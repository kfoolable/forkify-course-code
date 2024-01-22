import View from './View.js';
import previewView from './previewView.js';
import icons from 'url:../../img/icons.svg'; // Parcel 2

class BookMarksView extends View {
  _parentElement = document.querySelector('.bookmarks__list');
  _errorMsg = 'No bookmarks yet. Find a nice recipe and bookmark it :)';
  _message = '';

  addHandlerRender(handler) {
    window.addEventListener('load', handler);
  }

  _generateMarkup() {
    // console.log(this._data);
    return this._data
      .map((bookmark) => previewView.render(bookmark, false))
      .join('');
  }
}

export default new BookMarksView();

// Phil's explanation on how the bookmarks, results, and the previewView.js works:

// Hi Nikola,

// This part was tricky for me as well. The short answer to your question is that the markup is inserted by the ORIGINAL render() method called on the bookmarksView in the controlAddBookmark function within controller.js

// Since the first render() call has the default second parameter set to true (render = true), it will actually render the markup to the DOM. When it is set to false (render = false), it only returns markup. Think of it like a switch for a different setting.

// I will try my best to illustrate the flow of data below

// **controller.js**

// bookmarksView.render(model.state.bookmarks); // Hello, I make the original render call. My end goal is to add the markup to the DOM!
// This code first provides the bookmarks array data to the bookmarksView. Now, bookmarksView has access to the data (if the data exists or array is NOT empty). We are still in the ORIGINAL render() call for the bookmarksView from the controller. It's next job is to call _generateMarkup()

// **create a bookmarks view**

// Since the html markup and the overall code for bookmarks is almost exactly the same as the resultsView, we copy all of that code into a new js file called bookmarksView.js The only difference between the two are the parent elements where their html markup will be rendered, the message displayed and the error message.

// At this point, we realize our code violtaes the DRY (Don't Repeat Yourself Principle).

// **Keep code DRY : create previewView**

// So we create a new view (previewView) that contains the common aspects of bookmarksView and resultsView, which is basically only the ability to obtain the id from the url and the html template literal markup that's inserted in the DOM.

// bookmarksView and resultsView will rely on previewView to get their markup.

// The markup would normally have been rendered by bookmarksView and resultsView, respectively, by using the render function, but now previewView handles the markup.

// That poses the question: How does previewView get access to the data from the model?

// **bookmarksView**

// Within the render() function, we will store the result of _generateMarkup in a variable called markup

// _generateMarkup() will return a string. The string we need is in previewView but previewView doesn't know where the data is, so we need a way to pass the bookmarks array data to the previewView . We have a function for that! The render() method already passes data. Let's be efficient and instead of creating another function, we add a second parameter and gave the render method new instructions with the if statement.

// render(data, render = false){ if(!render) return markup;} // I will provide data to the view of your choice, but the view will not try to insert markup to the page if render = false

// This line of code is very important and it is saying "If render = false - DO NOT _clear() the parent element and DO NOT try to insert markup. I only want you to return a string. These rules only apply when we used previewView calls render() in the map() method below.

// _generateMarkup() { return this._data.map(bookmark => previewView.render(bookmark, false)).join('')}

// This _generateMarkup() method call belongs to bookmarksView, which is expecting a string that will be stored into the markup variable from the ORIGINAL render() call in the controller.

// When we make this following call in the map() method:

// previewView.render(bookmark, false) // Ok! I have my data (bookmarks). Oh, I noticed render = false: I will only deliver a string to _generateMarkup in bookmarksView

// We are basically saying: "Hi previewView, I am giving you the bookmarks data, but I DO NOT want you to place anything in the DOM. Can you please just package a string  inside the const markup variable and deliver it to the bookmarksView.render() call? Thank you!

// **previewView.js**

// So now, the map method goes to work and constructs a preview element with the markup we placed in the preview.js file . When it's done, it will package and deliver a string to the original call that asked for all this which is in....

// ***bookmarksView.js***

// bookmarksView.render(model.state.bookmarks) // My markup variable in the render method received a delivered string!

// Remember, the markup variable within the original render() function call, in this file, now contains the result of the returned string from

// previewView.render(bookmark, false) // I delivered a string!

// Since render = true by default for the original call, it has the permission to move on to the last two lines of the render() code. I explicitly stated that the parameter is true only in this example so that you realize that this is the function responsible for inserting the markup to the DOM.

// bookmarksView.render(model.state.bookmarks, render = true) // render is NOT false. Cool, now I can insert the elements to the DOM

//  this._clear(); this._parentElement.insertAdjacentHTML('afterbegin', markup);

// The way it clicked for me is to remember that the render() method has evolved a little. By default, it will actually place elements in the DOM, but when we set its second parameter to false, it will only return a string.

// The second key is that we're essentially making a render() call within another render() call. The difference between the two calls is that the second render() call that happens when we map over the bookmarks data returns a string to its "parent-call" which is bookmarksView.render(model.state.bookmarks). You can say that it's an employee/serving the parent call.

// It's the original call that has end goal of inserting the markup. The second call (in the map method) has the end goal of delivering a string.

// Sorry for the long post! I think I will post a drawn flowchart later, but I hope this made things clearer for everyone!

// I'll check back in to see if you have any additional questions.
