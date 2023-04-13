import { LitElement, css, html } from "lit";
import { customElement, query } from "lit/decorators.js";
import {
  BehaviorSubject,
  Subject,
  filter,
  map,
  mergeMap,
  of,
  sampleTime,
  startWith,
  switchMap,
  takeUntil,
  tap,
} from "rxjs";
import { filterForDoubleClick } from "@tronicboy/rxjs-operators";
import { observe } from "@tronicboy/lit-observe-directive";

const tagName = "wc-lit-todos";

type Todo = { text: string; id: number; created_at: string };

@customElement(tagName)
export class WcLitTodos extends LitElement {
  private teardown$ = new Subject<void>();
  disconnectedCallback(): void {
    super.disconnectedCallback();
    this.teardown$.next();
  }

  private pageNo$ = new BehaviorSubject(1);
  private refresh$ = new Subject<void>();
  private todos$ = this.refresh$.pipe(
    startWith(undefined),
    switchMap(() => this.pageNo$),
    switchMap((pageNo) => {
      const url = this.createURL();
      url.searchParams.set("page", String(pageNo));
      return fetch(url);
    }),
    mergeMap((result) => (result.ok ? (result.json() as Promise<Todo[]>) : of<Todo[]>([])))
  );

  @query("input#lookup") lookup!: HTMLInputElement;
  private input$ = new Subject<Event>();
  private todo$ = this.input$.pipe(
    sampleTime(100),
    map(() => this.lookup.value),
    map(Number),
    filter((id) => !isNaN(id) && id > 0),
    tap((id) => console.log(id)),
    switchMap((id) => fetch(this.createURL(id))),
    filter((result) => result.ok),
    mergeMap((result) => result.json() as Promise<Todo>)
  );

  private todoClick$ = new Subject<number>();
  @query("input#new-todo") newTodoInput!: HTMLInputElement;

  connectedCallback(): void {
    super.connectedCallback();
    this.todoClick$
      .pipe(
        takeUntil(this.teardown$),
        filterForDoubleClick(200),
        mergeMap((id) => fetch(this.createURL(id), { method: "DELETE" }))
      )
      .subscribe({
        next: () => this.refresh$.next(),
        error: (err) => console.error(err),
      });
    this.refresh$
      .pipe(
        switchMap(() =>
          fetch("https://api.api-ninjas.com/v1/loremipsum", {
            headers: { "X-Api-Key": "U7Wx9nE59Xx++ZqOvj1L0w==ILpTGo8Nj5y8XSR1" },
          })
        ),
        filter((result) => result.ok),
        mergeMap((result) => result.json()),
        map(({ text }) => text as string),
        map((text) => text.slice(0, 255)),
        takeUntil(this.teardown$)
      )
      .subscribe((text) => (this.newTodoInput.value = text));
  }

  private createURL(path?: string | number) {
    return new URL(`/wp-json/todo/v1/todos${path ? "/" + path : ""}`, document.location.origin);
  }

  private handleSubmit(event: Event) {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const formData = new FormData(form);
    fetch(this.createURL(), {
      body: formData,
      method: "POST",
    }).then(() => {
      this.refresh$.next();
      form.reset();
    });
  }

  render() {
    return html`<h1>All Todos</h1>
      <ul>
        ${observe(
          this.todos$.pipe(
            map((todos) =>
              todos.map(
                (todo) => html`<li @click=${this.todoClick$.next.bind(this.todoClick$, todo.id)}>
                  <small>${todo.id}</small>
                  <br />${todo.text}
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
      <input id="lookup" type="number" @input=${(event: InputEvent) => this.input$.next(event)} />
      ${observe(
        this.todo$.pipe(
          map(
            (todo) => html` <article>
              <h3>${todo.text}</h3>
              <p>${new Date(todo.created_at).toLocaleString()}</p>
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

  static styles = [
    css`
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
    `,
  ];
}

declare global {
  interface HTMLElementTagNameMap {
    [tagName]: WcLitTodos;
  }
}
