# My own explanation of the course I followed: 
[This course](https://www.sitepoint.com/react-rails-5-1/)

## Setting up the Rails API

To generate a new Rails API app:
```ruby
rails _5.1.3_ new --api idea-board -T -d postgresql
```
Get into the folder: `cd ideaboard-api`

Create the DB:  `rake db:create`

Next, let’s create the data model. We only need one data model for ideas with two fields — a title and a body

```ruby
rails g model Idea title:string body:text
```
and run migration: `rails db:migrate`

Create some seed data and run: `rake db:seed`.
You can find how to create the data in `db/seeds.rb`

Next, let’s create an IdeasController with an index action.
Note that the controller is under `app/controllers/api/v1` because we’re versioning our API. This is a good practice to avoid breaking changes and provide some backwards compatibility with our API.

Then add ideas as a resource with namespace in `config/routes.rb`

If you run the app `rails s -p 3001` you can test our endpoint for getting all ideas with curl:
```bash
curl -G http://localhost:3001/api/v1/ideas
```
or by going to `http://localhost:3001/api/v1/ideas` in your favourite browser

## Setting up Our Front-end App Using Create React App

Go back to the main folder and run in the terminal:
```bash
create-react-app front-ideaboard
```

Then `cd front-ideaboard` and `npm start` the frontend app should be running on port 3000

Clean it by removing the logo, the css you do not need and reorder the components into the component folder.

Let’s create this **IdeasContainer component** feel free to add css anytime.

### Fetching API Data with axios

Install axios: `npm install axios --save`
Then import it in **IdeasContainer:** `import axios from 'axios'` and use it in **componentDidMount()**

### Enabling Cross Origin Resource Sharing (CORS)

Add the gem: `gem 'rack-cors'` and follow documentation

Then add the middleware configuration to **config/application.rb** file:

```ruby
config.middleware.insert_before 0, Rack::Cors do
  allow do
    origins 'http://localhost:3000'
    resource '*', :headers => :any, :methods => [:get, :post, :put, :delete, :options]
  end
end
```
We restrict the origins to our front-end app at http://localhost:3000 and allow access to the standard REST API endpoint methods for all resources.

So now that we know we’re able to fetch ideas from our API, let’s use them in our React component.

We can change the render function to iterate through the list ideas from the state and display each of them.

Before we proceed, let’s refactor our code so far and move the JSX for the idea tiles into a separate _Stateless functional_ component called **Idea** Then inside the map function in IdeasContainer, we can return the new **Idea component.** Don’t forget to `import` Idea.

### Adding a new record

Next, we’ll add a way to create new ideas.
Let’s start by adding a button to add a new idea.
Inside the render function in **IdeasContainer**

Now when we click the button, we want another tile to appear with a form to edit the idea.

Once we edit the form, we want to submit it to our API to create a new idea.

#### API endpoint for creating a new idea
So let’s start of by first making an API endpoint for creating new ideas in **IdeasController** Create the create action and the strong parameters.

Now we have an API endpoint to which we can post idea data and create new ideas. Back in our React app, now let’s add a click handler called **addNewIdea** to the new idea button. Let’s define **addNewIdea** as a function that uses axios to make a POST call to our new idea endpoint with a blank idea. Let’s just log the response to the console for now. Check the console.

What we really want to happen is that, when we click the new idea button, an idea is created immediately, and a form for editing that idea appears on the page.

This way, we can use the same form and logic for editing any idea later on in the tutorial.

Before we do that, let’s first **order the ideas** on the page in reverse chronological order so that the newest ideas appear at the top.

So let’s change the definition of **@ideas** in **IdeasController** to order ideas in descending order of their **created_at** time.

Now, let’s continue with defining **addNewIdea**.

First, let’s use the response from our **POST** call to update the array of ideas in the state, so that when we add a new idea it appears on the page immediately.

We could just push the new idea to the array, since this is only an example app, but it’s good practice to use immutable data.

So let’s use **immutability-helper**, which is a nice package for updating data without directly mutating it.Install it with npm:

`npm install immutability-helper --save`

**I did not use it for Post have a look to the code, but used for put and update()**

Then import the update function in IdeasContainer `import update from 'immutability-helper'` and let’s use it inside addNewIdea to insert our new idea at the beginning of the array of ideas.
We make a new copy of this.state.ideas and use the **$splice** command to insert the new idea (in response.data) at the 0th index of this array.

> I did not use it have a look to the code

Then we use this new ideas array to update the state using setState.

Now if we try the app in the browser and click the new idea button, a new empty tile appears immediately.

We can proceed with **editing** this idea. First, we need a new state property **editingIdeaId**, which keeps track of which idea is being currently edited. By default, we’re not editing any idea, so let’s initialize editingIdeaId in the state with a null value.

Now when we add a new idea, in addition to adding it to **state.ideas**, we also want to set its id as the value of **state.editingIdeaId**. So let’s modify the **setState** call in **addNewIdea** to include also set **editingIdeaId**. So this indicates that we’ve just added a new idea and we want to edit it immediately.

#### A Form component

Now we can use **state.editingIdeaId**, in the render function, so that instead of displaying just a normal idea tile, we can display a form.

Inside the map function, let’s change the return value to a conditional statement, which renders an **IdeaForm** component if an idea’s id matches **state.editingIdeaId**, otherwise rendering an Idea component, Let’s import the **IdeaForm** component in **IdeasContainer** and let’s define it in **IdeaForm.js.** We’ll start with a simple class component, which renders a form with two input fields for the idea title and body. Let’s add a bit of CSS. Now when we click on the new idea button, a new tile appears with a form in it.

Let’s make this form functional!
We need to hook up the form input fields to the state.
First, let’s initialize the **IdeaForm** component state values from the idea prop that it receives from **IdeasContainer.**

Then set the form field values to their corresponding state values and set an **onChange** handler. We’ll define **handleInput** such that, when we type in either of the input fields, the corresponding state value and then the value of the field gets updated.(see code)

### API endpoint for updating ideas
First, we need to define an API endpoint for updating ideas. So let’s add an update action in **IdeasController.**


Back in **IdeaForm.js**, we’ll set an **onBlur** handler called **handleBlur** to the form.

We’ll define **handleBlur** to make a **PUT** call to our API endpoint for updating ideas with idea data from the state. For now, let’s just log the response to the console and see if our call works. We also need to import axios in this file to be able to use it.

Now if we click on the new idea button, edit its title and blur out of that field, we’ll see our API response logged in the console, with the new edited idea data.

The same thing happens if we edit the body and blur out of that field.(Checking edited idea data in the console)

So our **onBlur** handler works and we can edit our new idea, but we also need to send the edited idea data back up to **IdeasContainer** so that it can update its own state too.

Otherwise, **state.ideas** won’t have the updated value of the idea we just edited.

We’ll use a method called **updateIdea**, which we’ll pass as a prop from **IdeasContainer** to **IdeaForm**. We’ll call **updateIdea** with the response data from our API call.

Now in **IdeasContainer**, let’s send an **updateIdea** function as a prop to **IdeaForm**.

Let’s define the function to do an immutable update of the idea in **state.ideas**.
First, we find the **index** of the edited idea in the array, and then use the `$set` command to replace the old value with the new one. Finally, we call setState to update **state.ideas.**

We can see this in action in the browser with the React Developer Tools tab open.

### Displaying a success notification

Now we can add a new idea and edit it, but the user gets no visual feedback or confirmation when the idea is saved. So let’s add a notification message to tell the user when an idea has been successfully saved.

Let’s add a span next to the new idea button to display a notification from a value in state.

<span className="notification">
  {this.state.notification}
</span>
Let’s initialize **state.notification** as an empty string.

Now every time an idea gets updated, we’ll update **state.notification** with a success notification we want to show to the user.

So in the **setState** call in **updateIdea**, in addition to updating **ideas**, let’s also update **notification.**

Now when we edit an idea and blur out of the input field, the idea gets saved and we see the success notification.

We also want to reset the notification as soon as the user makes a change that hasn’t been saved yet.

So in the **handleInput** function of the **IdeaForm** component, let’s call a function called **resetNotification** to reset the notification message.

Now, inside the **render** function of **IdeasContainer**, let’s also pass **resetNotification** as a prop to **IdeaForm.**

Let’s define **resetNotification** as:

```react
resetNotification = () => {
  this.setState({notification: ''})
}
```
Now after a success notification appears, if we edit the idea again, the notification disappears.


### Editing an existing idea

Next, let’s add the ability to edit an existing idea. When we click on an idea tile, we want to change the tile so that it replaces the **Idea** component with an **IdeaForm** component to edit that idea.

Then we can edit the idea and it will get saved on blur.

In order to add this feature, we need to add a click handler on our idea tiles.

So first we need to convert our **Idea** component from a functional component into a class component and then we can set define a click handler function **handleClick** for the title and body.

Note that we have to add **this.props** to use the props value, because unlike in the functional component, we are no longer destructuring the props object.

**handleClick** calls **this.props.onClick** with the idea **id**.

Now, inside the **render** function of **IdeasContainer**, let’s also pass **onClick** as a prop to **Idea.**

We’ll define **enableEditing** to set the value of **state.editingIdeaId** to the clicked idea’s id

Now when we click on a tile, it instantly becomes editable.

When we click on a tile, once the form appears, let’s also set the cursor focus to the title input field.

We can do that by adding a `ref` on the title input field in **IdeaForm.**

We need to pass the `ref` as a prop, because we want to use it in the parent component **IdeasContainer**, where we can define the ref as a callback function.

Now we can use this `ref` in **enableEditing** to set the focus in the title input field.

Notice that we didn’t call **this.title.focus()** as a separate function after calling setState. Instead, we passed it to setState inside a callback as a second argument.

We did this because setState doesn’t always immediately update the component. By passing our focus call in a callback, we make sure that it gets called only after the component has been updated.

Now if we try the app in a browser, when we click on an idea tile, it becomes editable with a form and the cursor gets focused inside its title input field.
So now we can add and edit ideas.

### Deleting an idea

Finally, we want to be able to delete ideas.

When we hover over an idea tile, we want a delete button (in the form of a red cross) to appear in the top right corner. Clicking that cross should delete the idea and remove the tile from the board.

So let’s start by adding some markup and CSS to display the delete button on hover.

In the **Idea** component, add a div with a class deleteButton and the text ‘x’:

Then let’s add some CSS in App.css to hide this span by default and make it visible when we hover over a tile.

Next, let’s add a click handler **handleDelete** to this delete button, which then deletes the idea.

Similar to **handleClick**, we’ll define **handleDelete** as an arrow function that calls another function **this.props.onDelete** with the tile’s idea id.

Let’s pass **onDelete** as a prop from **IdeasContainer.**

We’ll define **deleteIdea** in a moment, but first let’s add an API endpoint for deleting ideas in **IdeasController.**(destroy action)

Now let’s define **deleteIdea** in **IdeasContainer** as a function that makes a **DELETE** call to our API with the idea id and, on success, updates **state.ideas.**

Once again, we look up the index of the deleted idea, use **update** with the **$splice** command to create a new array of ideas, and then update **state.ideas** with that.

Now we can try it in the browser. When we hover over an idea tile, the red delete button appears. Clicking on it deletes the idea and removes the tile from the board.

We now have a functional app with all the basic CRUD functionality!