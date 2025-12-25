import { twd, expect, userEvent, screenDom } from "twd-js";
import { createRoot } from "react-dom/client";
import { describe, it, beforeEach } from "twd-js/runner";
import todoListMock from "./mocks/todoList.json";
import { setupReactRoot } from "./utils";
import { createRoutesStub, useLoaderData, useMatches, useParams } from "react-router";
import TodoListPage from "~/routes/todolist";

describe("Todo List Page", () => {
  let root: ReturnType<typeof createRoot> | undefined;

  beforeEach(async () => {
    root = await setupReactRoot();
  });

  it("should display the todo list", async () => {
    const Stub = createRoutesStub([
      {
        path: "/",
        Component: () => {
          const loaderData = useLoaderData();
          const params = useParams();
          const matches = useMatches() as any;
          return <TodoListPage loaderData={loaderData} params={params} matches={matches} />;
        },
        loader() {
          return { todos: todoListMock };
        },
      },
    ]);

    // Render the Stub
    root!.render(<Stub />);
    await twd.wait(300);
    
    const todo1Title = await screenDom.getByText("Learn TWD");
    twd.should(todo1Title, "be.visible");
    
    const todo2Title = await screenDom.getByText("Build Todo App");
    twd.should(todo2Title, "be.visible");
    
    const todo1Description = await screenDom.getByText("Understand how to use TWD for testing web applications");
    twd.should(todo1Description, "be.visible");
    
    const todo2Description = await screenDom.getByText("Create a todo list application to demonstrate TWD features");
    twd.should(todo2Description, "be.visible");
    
    const todo1Date = await screenDom.getByText("Date: 2024-12-20");
    twd.should(todo1Date, "be.visible");
    
    const todo2Date = await screenDom.getByText("Date: 2024-12-25");
    twd.should(todo2Date, "be.visible");
  });

  it("should create a todo", async () => {
    let actionRequest = null;
    const Stub = createRoutesStub([
      {
        path: "/todos",
        Component: () => {
          const loaderData = useLoaderData();
          const params = useParams();
          const matches = useMatches() as any;
          return <TodoListPage loaderData={loaderData} params={params} matches={matches} />;
        },
        loader() {
          return { todos: [] };
        },
        async action({ request }) {
          const formData = await request.formData();
          const requestObject: Record<string, string> = {};
          formData.forEach((value, key) => {
            requestObject[key] = value.toString();
          });
          actionRequest = requestObject;
          return null;
        }
      },
    ]);

    // Render the Stub
    root!.render(<Stub initialEntries={["/todos"]} />);
    await twd.wait(300);

    const noTodosMessage = await screenDom.getByText("No todos yet. Create one above!");
    twd.should(noTodosMessage, "be.visible");

    const titleInput = await screenDom.getByLabelText("Title");
    await userEvent.type(titleInput, "Test Todo");

    const descriptionInput = await screenDom.getByLabelText("Description");
    await userEvent.type(descriptionInput, "Test Description");

    const dateInput = await screenDom.getByLabelText("Date");
    await userEvent.type(dateInput, "2024-12-20");

    const submitButton = await screenDom.getByRole("button", { name: "Create Todo" });
    await userEvent.click(submitButton);
    expect(actionRequest).to.deep.equal({
      title: "Test Todo",
      description: "Test Description",
      date: "2024-12-20",
    });
  });

  it("should delete a todo", async () => {
    let methodCalled = null;
    const Stub = createRoutesStub([
      {
        path: "/todos",
        Component: () => {
          const loaderData = useLoaderData();
          const params = useParams();
          const matches = useMatches() as any;
          return <TodoListPage loaderData={loaderData} params={params} matches={matches} />;
        },
        loader() {
          return { todos: todoListMock };
        },
        async action({ request }) {
          methodCalled = request.method;
          return null;
        }
      },
    ]);
    // Render the Stub
    root!.render(<Stub initialEntries={["/todos"]} />);
    await twd.wait(300);
    
    // Find the delete button for the first todo (Learn TWD)
    // Since there are multiple delete buttons, we'll get all and use the first one
    // which corresponds to the first todo item
    const deleteButtons = await screenDom.getAllByRole("button", { name: "Delete" });
    const deleteButton = deleteButtons[0];
    
    await userEvent.click(deleteButton);
    expect(methodCalled).to.equal("DELETE");
  });
});