"use strict";
const search = document.querySelector(".search-field");
const ddList = document.querySelector(".dropdown-list");
const repositories = document.querySelector(".repositories");

async function getRepos(request) {
  return await fetch(
    `https://api.github.com/search/repositories?q=${request}`,
    {
      headers: {
        "X-GitHub-Api-Version": "2022-11-28",
      },
    }
  )
    .then((response) => {
      if (response.ok) {
        response.json().then((repos) => {
          deleteDropdownList();
          const arr5 = repos.items.slice(0, 5);
          if (arr5.length === 0) {
            const noResults = document.createElement("p");
            noResults.classList.add("dropdown-item", "no-results");
            noResults.textContent = "Нет результатов";
            ddList.append(noResults);
          } else {
            arr5.forEach((repo) => {
              createSelect(repo);
            });
          }
        });
      }
    })
    .catch((err) => reject(err));
}

const debounce = (fn, debounceTime) => {
  let timeout;
  return function (...args) {
    const fnCall = () => {
      fn.apply(this, args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(fnCall, debounceTime);
  };
};

const debounceGetRepos = debounce(getRepos, 500);

search.addEventListener("input", () => {
  if (search.value.length === 0) {
    deleteDropdownList();
  }
  if (search.value[0] === " ") {
    return;
  }
  debounceGetRepos(search.value.trim());
});

// Создание пункта выпадающего меню
function createSelect(item) {
  const elem = document.createElement("div");
  elem.classList.add("dropdown-item");
  elem.textContent = item.name;
  elem.addEventListener("click", () => {
    createCard(item);
  });
  ddList.append(elem);
}

// Удаление выдачи выпадающего меню
function deleteDropdownList() {
  const ddListItems = ddList.querySelectorAll(".dropdown-item");
  ddListItems.forEach((item) => {
    item.remove();
  });
}

// Создание карточки репозитория
function createCard(item) {
  const repo = document.createElement("div");
  repo.classList.add("repo");
  const repoInfo = document.createElement("div");
  repoInfo.classList.add("repo-info");
  const close = document.createElement("button");
  close.classList.add("repo-btn");
  close.addEventListener("click", () => repo.remove());

  const name = document.createElement("p");
  name.textContent = `Name: ${item.name}`;
  const owner = document.createElement("p");
  owner.textContent = `Owner: ${item.owner.login}`;
  const stars = document.createElement("p");
  stars.textContent = `Stars: ${item.stargazers_count}`;

  search.value = "";
  deleteDropdownList();

  repoInfo.append(name);
  repoInfo.append(owner);
  repoInfo.append(stars);
  repo.append(repoInfo);
  repo.append(close);
  repositories.append(repo);
}
