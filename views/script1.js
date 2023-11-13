console.log("hiis")
// document.addEventListener("DOMContentLoaded", () => {
//   const seeProfileButton = document.getElementById("see-profile-button");
//   const profileDetails = document.querySelector(".profile-details");

//   seeProfileButton.addEventListener("click", () => {
//     // Make an AJAX request to retrieve user profile data
//     fetch("/profile", {
//       method: "GET",
//       headers: {
//         "Content-Type": "application/json",
//       },
//     })
//       .then((response) => response.json())
//       .then((data) => {
//         // Display user profile data
//         // console.log(data);
//         document.getElementById("profile-account-no").textContent =
//           data.account_number;
//         document.getElementById("profile-name").textContent = data.name;
//         // document.getElementById("profile-role").textContent =
//         //     data.balance;
//         document.getElementById("profile-email").textContent = data.email_id;
//         document.getElementById("profile-balance").textContent = data.balance;
//         document.getElementById("profile-phone-no").textContent = data.phone_no;
//         // Show the profile details section
//         profileDetails.style.display = "block";
//       })
//       .catch((error) => {
//         console.error("Error fetching profile data:", error);
//       });
//   });
// });
