// homepagebar setting

function Menubar(){
    window.location.href = "/Profile";
}

function Explore(){
    window.location.href="/explore"
}
function handlemenu() {
    const menu = document.getElementById("new-dialog");
    // const carousel = document.getElementById("demo");

    // Toggle hidden class for the menu
    menu.classList.toggle("hidden");

    // Toggle visibility of carousel
    // carousel.classList.toggle("hidden");
  }

function back(){
    window.location.href = "/";
}

// Get elements
 const modal = document.getElementById("logoutModal");
 const logoutBtn = document.getElementById("logoutBtn");
 const closeBtn = document.getElementById("closeBtn");
 const cancelBtn = document.getElementById("cancelLogout");
 const confirmBtn = document.getElementById("confirmLogout");
 const backbtn = document.getElementById("backbtn");

 // Show modal when logout button is clicked
 logoutBtn.onclick = function() {
     modal.classList.remove("hidden");
 }

 // Close modal when 'x' or 'Cancel' is clicked
 closeBtn.onclick = function() {
     modal.classList.add("hidden");
 }

 cancelBtn.onclick = function() {
     modal.classList.add("hidden");
 }

 // Confirm logout
 confirmBtn.onclick = function() {
     // Redirect to login page
     window.location.href = "#"
     modal.classList.add("hidden");
 }

 // Close modal if clicked outside of modal content
 window.onclick = function(event) {
     if (event.target === modal) {
         modal.classList.add("hidden");
     }
 }

 const edit = document.getElementById('editprofile');
 const profile =  document.getElementById('view-profile');

 // Function to show the selected image preview
 function showImage(event) {
    const file = event.target.files[0];
    console.log(file);  // Log the file to ensure it is selected
    const reader = new FileReader();

    reader.onloadend = function() {
        const profileImage = document.getElementById('view-profile-image');
        const profileImage1 = document.getElementById('view-profile-image1');

        profileImage.src = reader.result;
        profileImage1.src = reader.result;

       
    };

    if (file) {
        reader.readAsDataURL(file);
    }
}

 // Function to enable editing by toggling visibility of the form
 function enableEditing() {
     edit.classList.remove('hidden'); // Show the Edit Profile form
     profile.classList.add('hidden'); // Hide the view profile info
 }

 // close Edit-profile when backbtn is clicked 
 backbtn.onclick = function(){
     edit.classList.add('hidden'); // Hide the Edit Profile form
     profile.classList.remove('hidden'); // Show the view profile info
 }

 // Handle "Save Changes" button click
 document.getElementById('profileForm').addEventListener('submit', function(event) {
     event.preventDefault(); // Prevent actual form submission

     const form = event.target;

     if (!form.checkValidity()) {
         form.reportValidity(); // Show validation errors
     } else {
         // Get form values
         const profileData = {
             username: document.getElementById('name').value,
             contact: document.getElementById('contact').value,
             age: document.getElementById('age').value,
             gender: document.getElementById('gender').value
         };

         // Store data in localStorage
         localStorage.setItem('profileData', JSON.stringify(profileData));

         // Display the profile details
         displayProfileDetails(profileData);

         // Hide edit section and show profile details section
         edit.classList.add('hidden');
         profile.classList.remove('hidden');
     }
 });

 // Function to display profile details
 function displayProfileDetails(data) {
     document.getElementById('view-username').innerText = data.username;
     document.getElementById('view-contact').innerText = data.contact;
     document.getElementById('view-age').innerText = data.age;
     document.getElementById('view-gender').innerText = data.gender;
 }

 // Load profile data on page load
 window.onload = function() {
     const savedData = JSON.parse(localStorage.getItem('profileData'));
     if (savedData) {
         displayProfileDetails(savedData);
         edit.classList.add('hidden');
         profile.classList.remove('hidden');
     }
 }


 function book(){
    window.location.href = "/book";

 }

 function mainpage(){
    window.location.href = "/";

 }

 function audio(){
    window.location.href = "/audiobook";

 }

//  function Storypage(id1){
//    el = id1.id

//    window.location.href = "/get_video_link?id="+el;
//         fetch('/get_video_link?id='+el)
//         .then(response => response.json())  // Parse the response as JSON
//         .then(data => {
//             if (data.link) {
//                 // If the video link is found, you can use it (e.g., display the link or embed the video)
//                 console.log("Video Link: " + data.link);
//                 // Example: set the link to an iframe or display it
//                 document.getElementById('videoPlayer').src = data.link;  // Assuming you have an iframe with id "videoPlayer"
//             } else {
//                 console.error("Video not found");
//             }
//         })
//         .catch(error => {
//             console.error("Error fetching video link:", error);
//         });
//  }



 async function loadVideo(videoId) {
     id = videoId.id
    
     window.location.href = "/get_video?id="+id;
     
        if (data.error) {
            console.error("Video not found!");
            return;
        }
        loadComments(videoId);  // Load comments for the video
        // Set the main video
        document.getElementById("main-video").src = data.video.video_url;
        document.getElementById("video-title").textContent = data.video.title;

        // Update recommendations
        let recommendationsContainer = document.getElementById("recommendations");
        recommendationsContainer.innerHTML = ""; // Clear previous videos

        data.recommendations.forEach(video => {
            let videoDiv = document.createElement("div");
            videoDiv.className = "flex items-center space-x-4 bg-gray-800 p-2 rounded-lg video-item";
            videoDiv.innerHTML = `
                <img src="${video.thumbnail_url}" alt="Thumbnail" class="w-30 h-20 rounded-lg">
                <div>
                    <h4 class="text-white font-semibold">${video.title}</h4>
                    <p class="text-gray-400 text-sm">${video.channel_name}</p>
                </div>
            `;

            // Add click event to load the selected video
            videoDiv.addEventListener("click", () => loadVideo(video.id));

            recommendationsContainer.appendChild(videoDiv);
        });

        

    } 

// Example: Load video when clicking an image
document.querySelectorAll(".video-item").forEach(item => {
    item.addEventListener("click", function () {
        let videoId = this.getAttribute("data-id"); // Get video ID from data attribute
        loadVideo(videoId);
    });
});
