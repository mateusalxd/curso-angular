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
    selector: 'app-photo',
    templateUrl: './photo.component.html'
})
export class PhotoComponent {
    @Input() url: string;
    @Input() description: string;
}
```

```html
<app-photo url="https://upload.wikimedia.org/wikipedia/commons/f/f6/Old_violin.jpg" description="Violino"></app-photo>
```

- para criar componentes utilizando uma lista como base, existe a diretiva `ngFor`

```html
<!-- photos é uma propriedade do componente -->
<!-- a cada iteração, photo receberá um item da lista de photos -->
<!-- necessário utilizar o [ ] para realizar o data binding -->
<app-photo *ngFor="let photo of photos" [url]="photo.url" [description]="photo.description"></app-photo>
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
