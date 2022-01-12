function fetchUsers() {
  fetch("https://api.github.com/users")
    .then((res) => {
      if (!res.ok) {
        throw Error("Error");
      }
      return res.json();
    })
    .then((data) => {
      console.log(data);
      const html = data
        .map((user) => {
          return `
          <div class='user'>
            <p>${user.login}</p>
            <p><img src=${user.avatar_url} alt=${user.login}></p>
          </div>
          `;
        })
        .join("");
      console.log(html);
      document.querySelector("#users").insertAdjacentHTML("afterbegin", html);
    });
}
fetchUsers();
