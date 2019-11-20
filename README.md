# Anotações do curso de Angular

- para criar um novo projeto a partir do `angular-cli`, utilize `ng new NomeDoProjeto`
- para executar o projeto criado, entre no diretório do projeto e digite `ng serve --open`
- é possível utilizar uma *angular expression* para realizar um *data binding*

```html
<!-- {{ }} possibilita a construção de angular expression, utilizar para preencher conteúdo de tags html -->
<!-- titulo um é dado que vem do componente -->
<h1>Bem Vindo ao {{ titulo }}</h1>
```

- pode ser utilizado `[ ]` para fazer o *one way data binding*, do componente para o template, de um atributo de uma tag html com uma propriedade do compomente

```javascript
export class AppComponent {
    url = 'https://upload.wikimedia.org/wikipedia/commons/f/f6/Old_violin.jpg';
    description = 'Violino';
}
```

```html
<!-- url e description são as propriedades do componente exibido acima -->
<img [src]="url" [alt]="description">
```
