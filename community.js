document.addEventListener("DOMContentLoaded", function() {
    // Function to handle form submission and display comments
    function submitComment(event) {
        event.preventDefault();
        const form = event.target;
        const commentText = form.comment.value.trim();
        if (commentText !== "") {
            const commentList = form.parentElement.querySelector(".comment-list");
            const newComment = document.createElement("li");
            newComment.textContent = commentText;
            commentList.appendChild(newComment);
            form.reset();
        }
    }

    // Add event listener to comment form
    const commentForm = document.querySelector(".comment-form");
    commentForm.addEventListener("submit", submitComment);
});
function toggleAdditionalInfo(event) {
    event.preventDefault();
    const recipeCard = event.target.closest(".recipe-card");
    const additionalInfo = recipeCard.querySelector(".additional-info");
    additionalInfo.style.display = additionalInfo.style.display === "none" ? "block" : "none";
    event.target.textContent = additionalInfo.style.display === "none" ? "Read More" : "Read Less";
}

// Add event listener to all "Read More" links
const readMoreLinks = document.querySelectorAll(".read-more");
readMoreLinks.forEach(link => {
    link.addEventListener("click", toggleAdditionalInfo);
});