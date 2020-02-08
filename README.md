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
