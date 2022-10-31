// bubbling

const list = document.querySelector("#list");
const form = document.querySelector("#new-tweet-form");
const textarea = document.querySelector("#textarea");
const submitBtn = document.querySelector(".submit");
// generate unique ID
const generateId = () =>
  Math.floor((1 + Math.random()) * 0x10000)
    .toString(16)
    .substring(1);

// initial tweet
const tweets = [
  {
    tweetId: generateId(),
    username: "darmirs99@gmail.com",
    text: "Hey, my little boy",
    isLiked: true
  }
];

// generate tweet markup
const createTweets = ({ tweetId, username, text, isLiked }) => {
  const li = document.createElement("li");
  // додаємо унікальний дата трибут
  li.dataset.tweetId = tweetId;
  li.innerHTML = `
  <i class="fa-solid fa-xmark delete-icon"></i>
      <p class="username">${username}</p>
      <p class="tweets">${text}</p>
        <div class="buttons">
          <a href="#" class="like-button ${
            isLiked ? "like-button-active" : ""
          }">
            <i class="fas fa-heart"></i>
          </a>
        </div>
  `;

  return li;
};

textarea.addEventListener("input", (e) => {
  const counter = document.querySelector(".counter");
  const inputValueLength = e.target.value.length;
  const characterLimit = 50;
  // increment counter, when typing
  const inputValue = e.target.value;
  if (inputValueLength <= characterLimit) {
    counter.style.color = "";
  } else {
    counter.style.color = "red";
  }
  counter.textContent = `${inputValueLength}/${characterLimit}`;
  // if field is empty -disable button
  if (inputValue !== "") {
    submitBtn.removeAttribute("disabled");
  } else {
    submitBtn.setAttribute("disabled", true);
  }
});

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const data = new FormData(e.target); // витягаємо дані з нашої форми
  const tweetObj = {
    tweetId: generateId(),
    username: "darmirs99@gmail.com",
    text: data.get("text"), // по імені поля витягаємо
    isLiked: false
  };
  //save added tweet to localstorage
  saveTweets(tweetObj);
  list.append(
    createTweets(tweetObj)
    //text", "email" це ми звератємся за атрибутом name
  );
  textarea.value = "";
  submitBtn.setAttribute("disabled", true);
});

list.addEventListener("click", (event) => {
  event.preventDefault();
  //!!!! шукаємо найлижчий елемент, який задовльняє вказаний селектер
  const buttonElement = event.target.closest(".like-button");
  //якщо його знайшли, то переключаємо клас
  if (buttonElement !== null) {
    buttonElement.classList.toggle("like-button-active");
  }

  const deleteIcon = event.target.closest(".delete-icon");
  if (deleteIcon !== null) {
    const li = event.target.closest("li");
    removeTweets(li.dataset.tweetId);
    li.remove();
  }
});

function getTweets() {
  const localTweets = localStorage.getItem("tweets");
  if (localTweets === null) {
    return tweets;
  }
  return JSON.parse(localTweets);
}

function saveTweets(tweet) {
  const tweets = getTweets();
  tweets.push(tweet);
  localStorage.setItem("tweets", JSON.stringify(tweets));
}
function removeTweets(tweetId) {
  const tweets = getTweets();
  localStorage.setItem(
    "tweets",
    JSON.stringify(tweets.filter((tweet) => tweet.tweetId !== tweetId))
  );
}

const renderTweets = () => {
  const tweets = getTweets();
  tweets.forEach((tweet) => {
    list.append(createTweets(tweet));
  });
};

renderTweets();
