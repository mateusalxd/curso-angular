# Anotações do curso de Angular

- para criar um novo projeto a partir do `angular-cli`, utilize `ng new NomeDoProjeto`
- para executar o projeto criado, entre no diretório do projeto e digite `ng serve --open`
- é possível utilizar uma *angular expression* para realizar um *data binding*

```html
<!-- {{ }} possibilita a construção de angular expression, utilizar para preencher conteúdo de tags html -->
<!-- titulo é um dado que vem do componente -->
<h1>Bem Vindo ao {{ titulo }}</h1>
```

- pode ser utilizado `[ ]` para fazer o *one way data binding*, do componente para o template, de um atributo de uma tag html com uma propriedade do componente

```typescript
export class AppComponent {
    url = 'https://upload.wikimedia.org/wikipedia/commons/f/f6/Old_violin.jpg';
    description = 'Violino';
}
```

```html
<!-- url e description são as propriedades do componente exibido acima -->
<img [src]="url" [alt]="description">
```

- para um componente receber dados para seus atributos, *inbound properties*, é necessário utilizar o *decorator* `@Input()`

```typescript
@Component({
    selector: 'ap-photo',
    templateUrl: './photo.component.html'
})
export class PhotoComponent {
    @Input() url: string;
    @Input() description: string;
}
```

```html
<ap-photo url="https://upload.wikimedia.org/wikipedia/commons/f/f6/Old_violin.jpg" description="Violino"></ap-photo>
```

- para criar componentes utilizando uma lista como base, existe a diretiva `ngFor`

```html
<!-- photos é uma propriedade do componente -->
<!-- a cada iteração, photo receberá um item da lista de photos -->
<!-- necessário utilizar o [ ] para realizar o data binding -->
<ap-photo *ngFor="let photo of photos" [url]="photo.url" [description]="photo.description"></ap-photo>
```

- é possível realizar injeção de dependências através do construtor
```typescript
    // injeta o HttpClient na construção do componente
    // para esse caso foi necessário um provider na importação
    // dos módulo, que é o HttpClientModule
    constructor(http: HttpClient) {

    }
```

- para permitir que um componente possa ser injetado é necessário utilizar um *decorator*
```typescript
// para garantir que será utilizado somente um componente para
// toda a aplicação, utiliza-se providedIn como root
@Injectable({ providedIn: 'root' })
export class PhotoService { }
```

- para que um módulo que não é o principal consiga utilizar as diretivas do Angular, é necessário importar `CommonModule` no mesmo, no módulo principal é importado o `BrowserModule`, este não deve ser importados em outros módulos
```typescript
@NgModule({
    declarations: [PhotoComponent, PhotoListComponent],
    imports: [HttpClientModule, CommonModule]
})
export class PhotosModule { }
```

- o módulo de rotas permite a utilização de parâmetros no path
```typescript
// ao configurar a rota user/:userName, o :userName indica a existência
// de um parâmetro, que posteriormente poderá ser utilizado no componente
const routes: Routes = [
  { path: 'user/:userName', component: PhotoListComponent },
  { path: 'p/add', component: PhotoFormComponent }
];

...

// o componente recupera o parâmetro utilizando o ActivatedRoute
// que é injetado no construtor e demonstrado no ngOnInit
  constructor(private photoService: PhotoService,
    private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {

    const userName = this.activatedRoute.snapshot.params.userName;

    this.photoService
      .listFromUser(userName)
      .subscribe(photos => this.photos = photos);
  }
```

- para identificar rotas inválidas pode ser utilizado o path `**`
```typescript
const routes: Routes = [
  { path: 'user/:userName', component: PhotoListComponent },
  { path: 'p/add', component: PhotoFormComponent },
  { path: '**', component: NotFoundComponent },
];
```

- é possível identificar mudanças nas *inbound properties* através da interface `OnChanges`
```typescript
export class PhotosComponent implements OnChanges {

    @Input() photos: Photo[] = [];
    rows: any[] = [];

    constructor() { }

    // na variável changes é possível verificar a inbound property desejada
    ngOnChanges(changes: SimpleChanges) {
        if(changes.photos)
            this.rows = this.groupColumns(this.photos);
    }

    groupColumns(photos: Photo[]) { ... }
}
```

- pode ser utilizado `( )` para fazer o *one way event binding*, do template para o componente, de um evento JavaScript do template para um método ou atributo do componente
```html
<!-- keyup é o evento, filter é um atributo do componente e $event é a variável relacionada ao evento -->
<div class="text-center mt-3 mb-3">
    <form>
        <input
            class="rounded"
            type="search"
            placeholder="search..."
            autofocus
            (keyup)="filter = $event.target.value"
            >
    </form>
</div>
```

- para realizar transformações com o Angular, existem *pipes* prontos que fazem isso, por exemplo `CurrencyPipe` para formatação de moeda, `PercentPipe` para formatação de porcentagem entres outro
```html
<!-- após o | é informado o nome do pipe, em seguida são informados os parâmetros, se existirem -->
<p>A: {{a | currency:'BRL'}}</p>
<!-- saída A: R$ 50,55, considerando que 'a' vale 50.55 -->
```

- é possível criar um *pipe* personalizado usando a diretira `@Pipe` e implementando a interface `PipeTransform`
```typescript
@Pipe({
  name: 'filterByDescription'
})
export class FilterByDescriptionPipe implements PipeTransform {

  transform(photos: Photo[], descriptionQuery: string): any {
    ...
  }

}
```

- a diretiva `*ngIf` possibilita que seja avaliada uma expressão, dependendo o resultado da expressão uma tag html pode ser exibida ou não
```html
<!-- só irá exibir o parágrafo se não existir nenhuma foto -->
<p *ngIf="!photos.length" class="text-center text-muted">Nenhuma foto encontrada</p>
```

- quando dependemos do retorno de dados de uma API, pode acontecer de aparecerem informações da página que não deveriam aparecer, por exemplo, a mensagem "Nenhuma foto encontrada" assim que carregamos a página, porém ele some alguns milésimos de segundos após a API retornar as fotos, para evitar isso, é possível utilizar um `Resolve`, que irá recuperar as informações da API antes de carregar a página.
```typescript
...

@Injectable({ providedIn: 'root' })
// o Resolve deve ser do tipo do retorno da API, neste caso
// é um Observable<Photo[]>
export class PhotoListResolve implements Resolve<Observable<Photo[]>> {

    constructor(private service: PhotoService) { }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Photo[]> {
        const userName = route.params.userName;
        return this.service.listFromUser(userName);
    }

}

// para utilizar o Resolve, vinculamos ele a rota desejada, para este caso
// utilizamos "photos" para armezanar o resultado do Resolve, que posteriormente
// poderá ser recuperado no componente
const routes: Routes = [
  { path: 'user/:userName', component: PhotoListComponent, resolve: { photos: PhotoListResolve } },
  { path: 'p/add', component: PhotoFormComponent },
  { path: '**', component: NotFoundComponent },
];


export class PhotoListComponent implements OnInit {
  ...
  constructor(private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    // recuperando os dados do Resolve
    this.photos = this.activatedRoute.snapshot.data['photos'];
  }

}
```

- para evitar chamadas desnecessárias de uma API que é utilizada em eventos de pressionamente de teclas, por exemplo, podemos utilizar `Subject` combinado com `debounceTime`

```typescript
  ...
  // criamos o Subject que possibilitará que possamos
  // emitir e receber informações
  debounce: Subject<string> = new Subject<string>();

  ngOnInit(): void {
    // o debounceTime define que iremos receber a última informação após
    // 300 milésimos de segundos sem nenhuma outra emissão
    this.debounce.pipe(debounceTime(300)).subscribe(filter => this.filter = filter);
  }

  ngOnDestroy(): void {
    // é necessário desinscrever para indicar que não iremos mais
    // receber informações, isso irá evitar problemas de memória
    this.debounce.unsubscribe();
  }
```

```html
  <input
      class="rounded"
      type="search"
      placeholder="search..."
      autofocus
      (keyup)="this.debounce.next($event.target.value)" 
      >
      <!-- utilizamos next para emitir um novo valor para quem estiver
      inscrito no Subject, isso acontecerá a cada tecla pressionara -->
```

- é possível utilizar `else` com um `*ngIf` através de templates
```html
<!-- hasMore é um propriedade do componente, casa ela seja avaliada como true, 
então é exibida a div e button, caso contrário é exibido o que está no 
template messageTemplate -->
<div class="text-center" *ngIf="hasMore; else messageTemplate">
    <button class="btn btn-primary">Carregar mais</button>
</div>

<!-- utiliza-se # para definir o nome do template -->
<ng-template #messageTemplate>
    <p class="text-center text-muted">Sem dados para carregar</p>
</ng-template>
```

- as propriedades dos componentes, quando atualizadas, podem manter as mesmas referências dependendo da maneira como são atualizadas, isso deve ser observado e arrumado
```typescript
  load() {
    this.photoService
      .listFromUserPaginated(this.userName, ++this.currentPage)
      .subscribe(photos => {
        // this.photos é uma propriedade do componente,
        // para que as tags HTML sejam atualizadas corretamente
        // é necessário mudar sua referência, uma das maneiras
        // de se fazer isso é utilizando o concat
        this.photos = this.photos.concat(photos);
        if (!photos.length) this.hasMore = false;
      });
  }
```