var g = Object.defineProperty;
var x = (e, t, o) => t in e ? g(e, t, { enumerable: !0, configurable: !0, writable: !0, value: o }) : e[t] = o;
var h = (e, t, o) => (x(e, typeof t != "symbol" ? t + "" : t, o), o);
import { noChange as k, css as v, LitElement as y, html as m } from "lit";
import { query as w, customElement as T } from "lit/decorators.js";
import { buffer as L, debounceTime as N, filter as p, map as r, Subject as n, takeUntil as b, BehaviorSubject as C, startWith as j, switchMap as l, mergeMap as a, of as D, sampleTime as S, tap as U } from "rxjs";
import { directive as E } from "lit/directive.js";
import { AsyncDirective as O } from "lit/async-directive.js";
function P(e = 250) {
  return (t) => t.pipe(L(t.pipe(N(e))), p((o) => o.length > 1), r(([o]) => o));
}
class R extends O {
  constructor() {
    super(...arguments);
    h(this, "source");
    h(this, "disconnected$", new n());
  }
  render(o) {
    return this.source = o.pipe(b(this.disconnected$)), this.subscribe(), k;
  }
  disconnected() {
    this.disconnected$.next();
  }
  reconnected() {
    this.subscribe();
  }
  subscribe() {
    this.isConnected && this.source.subscribe({
      next: (o) => this.setValue(o),
      error: (o) => console.error(o)
    });
  }
}
function f(e) {
  return E(R)(e);
}
var _ = Object.defineProperty, A = Object.getOwnPropertyDescriptor, $ = (e, t, o, c) => {
  for (var i = c > 1 ? void 0 : c ? A(t, o) : t, d = e.length - 1, u; d >= 0; d--)
    (u = e[d]) && (i = (c ? u(t, o, i) : u(i)) || i);
  return c && i && _(t, o, i), i;
};
const I = "wc-lit-todos";
let s = class extends y {
  constructor() {
    super(...arguments), this.teardown$ = new n(), this.pageNo$ = new C(1), this.refresh$ = new n(), this.todos$ = this.refresh$.pipe(
      j(void 0),
      l(() => this.pageNo$),
      l((e) => {
        const t = this.createURL();
        return t.searchParams.set("page", String(e)), fetch(t);
      }),
      a((e) => e.ok ? e.json() : D([]))
    ), this.input$ = new n(), this.todo$ = this.input$.pipe(
      S(100),
      r(() => this.lookup.value),
      r(Number),
      p((e) => !isNaN(e) && e > 0),
      U((e) => console.log(e)),
      l((e) => fetch(this.createURL(e))),
      p((e) => e.ok),
      a((e) => e.json())
    ), this.todoClick$ = new n();
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this.teardown$.next();
  }
  connectedCallback() {
    super.connectedCallback(), this.todoClick$.pipe(
      b(this.teardown$),
      P(200),
      a((e) => fetch(this.createURL(e), { method: "DELETE" }))
    ).subscribe({
      next: () => this.refresh$.next(),
      error: (e) => console.error(e)
    }), this.refresh$.pipe(
      l(
        () => fetch("https://api.api-ninjas.com/v1/loremipsum", {
          headers: { "X-Api-Key": "U7Wx9nE59Xx++ZqOvj1L0w==ILpTGo8Nj5y8XSR1" }
        })
      ),
      p((e) => e.ok),
      a((e) => e.json()),
      r(({ text: e }) => e),
      r((e) => e.slice(0, 255)),
      b(this.teardown$)
    ).subscribe((e) => this.newTodoInput.value = e);
  }
  createURL(e) {
    return new URL(`/wp-json/todo/v1/todos${e ? "/" + e : ""}`, document.location.origin);
  }
  handleSubmit(e) {
    e.preventDefault();
    const t = e.target, o = new FormData(t);
    fetch(this.createURL(), {
      body: o,
      method: "POST"
    }).then(() => {
      this.refresh$.next(), t.reset();
    });
  }
  render() {
    return m`<h1>All Todos</h1>
      <ul>
        ${f(
      this.todos$.pipe(
        r(
          (e) => e.map(
            (t) => m`<li @click=${this.todoClick$.next.bind(this.todoClick$, t.id)}>
                  <small>${t.id}</small>
                  <br />${t.text}
                </li>`
          )
        )
      )
    )}
      </ul>
      <nav>
        <button @click=${() => this.pageNo$.next(this.pageNo$.value - 1)}>Back</button>
        <button @click=${() => this.pageNo$.next(this.pageNo$.value + 1)}>Next</button>
      </nav>
      <h1>Todo Lookup</h1>
      <input id="lookup" type="number" @input=${(e) => this.input$.next(e)} />
      ${f(
      this.todo$.pipe(
        r(
          (e) => m` <article>
              <h3>${e.text}</h3>
              <p>${new Date(e.created_at).toLocaleString()}</p>
            </article>`
        )
      )
    )}

      <h1>New Todo</h1>
      <form @submit=${this.handleSubmit}>
        <label for="text">Text</label>
        <input id="new-todo" type="text" name="text" id="text" maxlength="255" required bind:value="{textInput}" />
        <button type="submit">Add</button>
      </form>`;
  }
};
s.styles = [
  v`
      :host {
        background-color: lightblue;
        display: block;
        padding: 1rem;
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
    `
];
$([
  w("input#lookup")
], s.prototype, "lookup", 2);
$([
  w("input#new-todo")
], s.prototype, "newTodoInput", 2);
s = $([
  T(I)
], s);
function B(e, t) {
  const o = t.createElement;
  e.registerBlockType("create-block/todo-api-block", {
    edit: () => o("wc-lit-todos", null, ""),
    save: () => o("wc-lit-todos", null, ""),
    title: "Todo API",
    category: "widgets",
    icon: "menu"
  });
}
B(window.wp.blocks, window.wp.element);
