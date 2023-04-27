var v=Object.defineProperty;var y=(e,t,o)=>t in e?v(e,t,{enumerable:!0,configurable:!0,writable:!0,value:o}):e[t]=o;var h=(e,t,o)=>(y(e,typeof t!="symbol"?t+"":t,o),o);import{noChange as L,css as T,LitElement as C,html as b}from"lit";import{query as x,customElement as N}from"lit/decorators.js";import{buffer as j,debounceTime as B,filter as d,map as r,Subject as l,takeUntil as f,BehaviorSubject as R,startWith as D,switchMap as c,mergeMap as a,of as E,sampleTime as O,tap as S}from"rxjs";import{directive as _}from"lit/directive.js";import{AsyncDirective as U}from"lit/async-directive.js";function A(e=250){return t=>t.pipe(j(t.pipe(B(e))),d(o=>o.length>1),r(([o])=>o))}class I extends U{constructor(){super(...arguments);h(this,"source");h(this,"disconnected$",new l)}render(o){return this.source=o.pipe(f(this.disconnected$)),this.subscribe(),L}disconnected(){this.disconnected$.next()}reconnected(){this.subscribe()}subscribe(){this.isConnected&&this.source.subscribe({next:o=>this.setValue(o),error:o=>console.error(o)})}}function w(e){return _(I)(e)}var W=Object.defineProperty,K=Object.getOwnPropertyDescriptor,$=(e,t,o,i)=>{for(var n=i>1?void 0:i?K(t,o):t,p=e.length-1,u;p>=0;p--)(u=e[p])&&(n=(i?u(t,o,n):u(n))||n);return i&&n&&W(t,o,n),n};const z="wc-lit-todos";let s=class extends C{constructor(){super(...arguments),this.teardown$=new l,this.pageNo$=new R(1),this.refresh$=new l,this.todos$=this.refresh$.pipe(D(void 0),c(()=>this.pageNo$),c(e=>{const t=this.createURL();return t.searchParams.set("page",String(e)),fetch(t)}),a(e=>e.ok?e.json():E([]))),this.input$=new l,this.todo$=this.input$.pipe(O(100),r(()=>this.lookup.value),r(Number),d(e=>!isNaN(e)&&e>0),S(e=>console.log(e)),c(e=>fetch(this.createURL(e))),d(e=>e.ok),a(e=>e.json())),this.todoClick$=new l,this.message="you"}disconnectedCallback(){super.disconnectedCallback(),this.teardown$.next()}connectedCallback(){super.connectedCallback(),this.todoClick$.pipe(f(this.teardown$),A(200),a(e=>fetch(this.createURL(e),{method:"DELETE"}))).subscribe({next:()=>this.refresh$.next(),error:e=>console.error(e)}),this.refresh$.pipe(c(()=>fetch("https://api.api-ninjas.com/v1/loremipsum",{headers:{"X-Api-Key":"U7Wx9nE59Xx++ZqOvj1L0w==ILpTGo8Nj5y8XSR1"}})),d(e=>e.ok),a(e=>e.json()),r(({text:e})=>e),r(e=>e.slice(0,255)),f(this.teardown$)).subscribe(e=>this.newTodoInput.value=e)}createURL(e){return new URL(`/wp-json/todo/v1/todos${e?"/"+e:""}`,document.location.origin)}handleSubmit(e){e.preventDefault();const t=e.target,o=new FormData(t);fetch(this.createURL(),{body:o,method:"POST"}).then(()=>{this.refresh$.next(),t.reset()})}render(){return b`<h1 i18n>All Todos</h1>
      <ul>
        ${w(this.todos$.pipe(r(e=>e.map(t=>b`<li @click=${this.todoClick$.next.bind(this.todoClick$,t.id)}>
                  <small>${t.id}</small>
                  <br />${t.text}
                </li>`))))}
      </ul>
      <p>${"Hello World "+this.message+""}</p>
      <nav>
        <button @click=${()=>this.pageNo$.next(this.pageNo$.value-1)}>Back</button>
        <button @click=${()=>this.pageNo$.next(this.pageNo$.value+1)}>Next</button>
      </nav>
      <h1>Todo Lookup</h1>
      <input id="lookup" type="number" @input=${e=>this.input$.next(e)} />
      ${w(this.todo$.pipe(r(e=>b` <article>
              <h3>${e.text}</h3>
              <p>${new Date(e.created_at).toLocaleString()}</p>
            </article>`)))}

      <h1>New Todo</h1>
      <form @submit=${this.handleSubmit}>
        <label for="text">Text</label>
        <input id="new-todo" type="text" name="text" id="text" maxlength="255" required bind:value="{textInput}" />
        <button type="submit">Add</button>
      </form>`}};s.styles=[T`
      :host {
        background-color: white;
        border: 1px solid white;
        border-radius: 4px;
        display: block;
        padding: 1rem;
        width: 90%;
        max-width: 700px;
        margin: 1rem auto;
      }

      h1:first-child {
        margin-top: 0;
      }

      ul {
        list-style-type: none;
        margin: 0;
        padding: 0;
      }

      li {
        background-color: white;
        border: 1px solid white;
        border-radius: 4px;
        margin: 1rem 0;
        padding: 0.5rem 1rem;
        user-select: none;
      }
      li:first-child {
        margin-top: 0;
      }
      li:last-child {
        margin-bottom: 0;
      }
    `];$([x("input#lookup")],s.prototype,"lookup",2);$([x("input#new-todo")],s.prototype,"newTodoInput",2);s=$([N(z)],s);/**
 * @license Angular v15.2.8
 * (c) 2010-2022 Google LLC. https://angular.io/
 * License: MIT
 */const q=":";var g;(function(e){e[e.Little=0]="Little",e[e.Big=1]="Big"})(g||(g={}));function G(e,t){for(let o=1,i=1;o<e.length;o++,i++)if(t[i]==="\\")i++;else if(e[o]===q)return o;throw new Error(`Unterminated $localize metadata block in "${t}".`)}const M=/* @__PURE__ */(()=>typeof globalThis<"u"&&globalThis||typeof global<"u"&&global||typeof window<"u"&&window||typeof self<"u"&&typeof WorkerGlobalScope<"u"&&self instanceof WorkerGlobalScope&&self)(),m=function(e,...t){if(m.translate){const i=m.translate(e,t);e=i[0],t=i[1]}let o=k(e[0],e.raw[0]);for(let i=1;i<e.length;i++)o+=t[i-1]+k(e[i],e.raw[i]);return o},X=":";function k(e,t){return t.charAt(0)===X?e.substring(G(e,t)+1):e}/**
 * @license Angular v15.2.8
 * (c) 2010-2022 Google LLC. https://angular.io/
 * License: MIT
 */M.$localize=m;function F(e,t,o){const i=t.createElement;e.registerBlockType("create-block/todo-api-block",{edit:()=>{const n=o.useBlockProps();return i("wc-lit-todos",n,"")},save:()=>i("wc-lit-todos",null,""),title:"Todo API",category:"widgets",icon:"menu"})}F(window.wp.blocks,window.wp.element,window.wp.blockEditor);