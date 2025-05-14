document
  .getElementById("profile-form")
  .addEventListener("submit", function (event) {
    event.preventDefault();
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const profilePicInput = document.getElementById("profile-pic-input");
    let profilePic = "images/default-profile.png";
    if (profilePicInput.files && profilePicInput.files[0]) {
      const reader = new FileReader();
      reader.onload = function (e) {
        profilePic = e.target.result;
        saveProfile(name, email, password, profilePic);
      };
      reader.readAsDataURL(profilePicInput.files[0]);
    } else {
      saveProfile(name, email, password, profilePic);
    }
  });
function saveProfile(name, email, password, profilePic) {
  localStorage.setItem("profileName", name);
  localStorage.setItem("profileEmail", email);
  localStorage.setItem("profilePassword", password);
  localStorage.setItem("profilePic", profilePic);
  window.location.href = "/admin/newadmin.hbs";
}
