const books = [];
const RENDER_EVENT = "render-books";
const SAVED_EVENT = "saved-books";
const STORAGE_KEY = "BOOKSHELF_APP";
const inputBookForm = document.getElementById("inputBook");
const searchBookForm = document.getElementById("searchBook");
const incompleteBookshelfList = document.getElementById(
  "incompleteBookshelfList"
);
const completeBookshelfList = document.getElementById("completeBookshelfList");
function isStorageExist() {
  if (typeof Storage === undefined) {
    alert("Your browser dont support local storage");
    return false;
  }
  return true;
}
function addTask() {
  if (searchBookTitle.value === "") {
    alert("You must add something!");
    return false;
  }
  return true;
}

function loadDataFromStorage() {
  const serializedData = localStorage.getItem(STORAGE_KEY);
  let data = JSON.parse(serializedData);
  if (data !== null) {
    for (const book of data) {
      books.push(book);
    }
  }
  document.dispatchEvent(new Event(RENDER_EVENT));
}
document.addEventListener("DOMContentLoaded", function () {
  const inputBookForm = document.getElementById("inputBook");
  inputBookForm.addEventListener("submit", function (event) {
    event.preventDefault();
    addBook();
  });
  document.addEventListener(RENDER_EVENT, function () {
    const incompletedBookList = document.getElementById(
      "incompleteBookshelfList"
    );
    incompletedBookList.innerHTML = "";
    const completedBookList = document.getElementById("completeBookshelfList");
    completedBookList.innerHTML = "";
    for (const bookItem of books) {
      const bookElement = makeBookElement(bookItem);
      if (!bookItem.isComplete) {
        incompletedBookList.appendChild(bookElement);
      } else {
        completedBookList.appendChild(bookElement);
      }
    }
  });
  document.addEventListener(SAVED_EVENT, function () {
    console.log(localStorage.getItem(STORAGE_KEY));
  });
  function addBook() {
    const title = document.getElementById("inputBookTitle").value;
    const author = document.getElementById("inputBookAuthor").value;
    const year = document.getElementById("inputBookYear").value;
    const isComplete = document.getElementById("inputBookIsComplete").checked;
    const generatedID = generateID();
    const bookObject = generateBookObject(
      generatedID,
      title,
      author,
      year,
      isComplete
    );
    books.push(bookObject);
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
    inputBookForm.reset();
  }
  function generateID() {
    return +new Date();
  }
  function generateBookObject(id, title, author, year, isComplete) {
    return {
      id,
      title,
      author,
      year,
      isComplete,
    };
  }
  function makeBookElement(bookObject) {
    //const bookshelf = document.getElementsByClassName('book_shelf');
    //const incompleteBookshelf = document.getElementById('incompleteBookshelfList');
    //const completeBookshelf = document.getElementById('completeBookshelfList');
    const bookTtile = document.createElement("h3");
    bookTtile.innerText = bookObject.title;
    const bookAuthor = document.createElement("p");
    bookAuthor.innerText = `Author : ${bookObject.author}`;
    const bookYear = document.createElement("p");
    bookYear.innerText = `Year : ${bookObject.year}`;
    const bookContainer = document.createElement("article");
    bookContainer.classList.add("book_item");
    bookContainer.append(bookTtile, bookAuthor, bookYear);
    const buttonContainer = document.createElement("div");
    buttonContainer.classList.add("action");
    const deleteButton = document.createElement("button");
    deleteButton.classList.add("red");
    deleteButton.innerText = "delete";
    deleteButton.addEventListener("click", function () {
      deleteBook(bookObject.id);
    });
    if (bookObject.isComplete) {
      const incompletedButton = document.createElement("button");
      incompletedButton.classList.add("green");
      incompletedButton.innerText = "Read";
      incompletedButton.addEventListener("click", function () {
        addToIncompleteBookshelf(bookObject.id);
      });
      completeBookshelfList.appendChild(bookContainer);
      buttonContainer.append(incompletedButton, deleteButton);
    } else {
      const completedButton = document.createElement("button");
      completedButton.classList.add("green");
      completedButton.innerText = "Done";
      completedButton.addEventListener("click", function () {
        addToCompleteBookshelf(bookObject.id);
      });
      incompleteBookshelfList.appendChild(bookContainer);
      buttonContainer.append(completedButton, deleteButton);
    }
    bookContainer.append(buttonContainer);
    return bookContainer;
  }
  function addToCompleteBookshelf(bookId) {
    const bookTarget = findBook(bookId);
    if (bookTarget == null) return;
    bookTarget.isComplete = true;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
  }
  function addToIncompleteBookshelf(bookId) {
    const bookTarget = findBook(bookId);
    if (bookTarget == null) return;

    bookTarget.isComplete = false;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
  }
  function deleteBook(bookId) {
    const bookTarget = findBookIndex(bookId);
    if (bookTarget == -1) return;
    books.splice(bookTarget, 1);
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
  }
  function findBook(bookId) {
    for (const bookItem of books) {
      if (bookItem.id === bookId) {
        return bookItem;
      }
    }
    return null;
  }
  function findBookIndex(bookId) {
    for (const index in books) {
      if (books[index].id === bookId) {
        return index;
      }
    }
    return -1;
  }
  function saveData() {
    const parsed = JSON.stringify(books);
    localStorage.setItem(STORAGE_KEY, parsed);
    document.dispatchEvent(new Event(SAVED_EVENT));
  }
  if (isStorageExist()) {
    loadDataFromStorage();
  }
});
