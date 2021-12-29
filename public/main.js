const username = document.getElementById("user-name");
const userImage = document.getElementById("user-image");
const submitButton = document.getElementById("submit-button");
const usersDiv = document.getElementById("users");
let globalUser;

document.getElementById("add-user").addEventListener("submit", (e) => {
  e.preventDefault();
  if (submitButton.innerText === "Submit") {
    if (!username.value || !userImage.files[0]) {
      alert("please provide the inputs.");
      return;
    }
    let data = new FormData();
    data.append("name", username.value);
    data.append("user_img", userImage.files[0]);
    fetch("http://localhost:8080/api/users", {
      method: "POST",
      mode: "cors",
      body: data,
    })
      .then((res) => res.json())
      .then((user) => {
        alert(`${user.name} user created successfully`);
        username.value = "";
        userImage.value = null;
        createUserDiv(user);
      });
  } else if (submitButton.innerText === "Edit") {
    if (username.value === "") {
      alert("Inputs should not be empty.");
      return;
    }
    let data = new FormData();
    data.append("id", globalUser.id);
    data.append("name", username.value);
    if (userImage.files[0]) data.append("user_img", userImage.files[0]);
    fetch("http://localhost:8080/api/users", {
      method: "PATCH",
      mode: "cors",
      body: data,
    })
      .then((res) => res.json())
      .then((data) => {
        alert(`${data.message}`);
        username.value = "";
        userImage.value = null;
      });
  }
});

document.addEventListener("DOMContentLoaded", () => {
  fetch("http://localhost:8080/api/users")
    .then((res) => res.json())
    .then((data) => {
      data.forEach((user) => {
        createUserDiv(user);
      });
    });
});

function createUserDiv(user) {
  const userDetailContainer = document.createElement("div");
  const usernameHeader = document.createElement("h3");
  const userImage = document.createElement("img");
  const editButton = document.createElement("button");
  const deleteButton = document.createElement("button");
  const buttonsDiv = document.createElement("div");

  editButton.innerText = "Edit";
  deleteButton.innerText = "Delete";

  buttonsDiv.appendChild(editButton);
  buttonsDiv.appendChild(deleteButton);

  buttonsDiv.classList.add("buttons");

  usernameHeader.innerText = user.name;
  userImage.src = `http://localhost:8080/${user.img_path}`;

  userDetailContainer.classList.add("user-detail-container");

  userDetailContainer.appendChild(usernameHeader);
  userDetailContainer.appendChild(userImage);
  userDetailContainer.appendChild(buttonsDiv);
  usersDiv.appendChild(userDetailContainer);

  editButton.addEventListener("click", () => {
    alert("Edit User(not implemented)");
    username.value = user.name;
    submitButton.innerText = "Edit";
    globalUser = user;
  });

  deleteButton.addEventListener("click", () => {
    const userRes = prompt("Enter CONFIRM to delete user?");
    if (userRes === "CONFIRM") {
      fetch(`http://localhost:8080/api/users/${user.id}`, {
        method: "DELETE",
      })
        .then((res) => res.json())
        .then((data) => {
          alert(data.message);
          usersDiv.removeChild(userDetailContainer);
        });
    }
  });
}
