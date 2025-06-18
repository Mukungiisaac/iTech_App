let list = document.querySelectorAll(".navigation")

function activeLink(){
    list.forEach((item) =>{
        item.classList.remove("hovered")
    } );
    this.classList.add("hovered");
}
list.forEach(item => item.addEventListener("mouseover", activeLink));

let toggle = document.querySelector(".toggle")

let navigation = document.querySelector(".navigation")

let main = document.querySelector(".main")

toggle.onclick = function() {
    navigation.classList.toggle("active");
    main.classList.toggle("active");
};


// Portfolio

// document.addEventListener("DOMContentLoaded", function () {
//     // Smooth scrolling for navigation links
//     const links = document.querySelectorAll("nav ul li a");
    
//     links.forEach(link => {
//         link.addEventListener("click", function (event) {
//             event.preventDefault();
//             const targetId = this.getAttribute("href").substring(1);
//             const targetElement = document.getElementById(targetId);
            
//             window.scrollTo({
//                 top: targetElement.offsetTop - 50,
//                 behavior: "smooth"
//             });
//         });
//     });


    // Footer
    const footer = document.getElementById('smartFooter');
    let timeoutId;

    footer.addEventListener('mouseenter', () => {
        footer.classList.add('show')
        clearTimeout(timeoutId);
    });

    footer.addEventListener('mouseleave', () => {
        timeoutId = setTimeout(() => {
            footer.classList.remove('show');
        }, 3000)
    });

    // Dark mode toggle
//     const darkModeToggle = document.createElement("button");
//     darkModeToggle.innerText = "Toggle Dark Mode";
//     darkModeToggle.style.position = "fixed";
//     darkModeToggle.style.bottom = "20px";
//     darkModeToggle.style.right = "20px";
//     darkModeToggle.style.padding = "10px";
//     darkModeToggle.style.backgroundColor = "#333";
//     darkModeToggle.style.color = "#fff";
//     darkModeToggle.style.border = "none";
//     darkModeToggle.style.cursor = "pointer";
//     document.body.appendChild(darkModeToggle);

//     darkModeToggle.addEventListener("click", function () {
//         document.body.classList.toggle("dark-mode");
//     });

//     // Dark mode styles
//     const darkModeStyle = document.createElement("style");
//     darkModeStyle.innerHTML = `
//         .dark-mode {
//             background-color: #222;
//             color: #fff;
//         }
//         .dark-mode header,
//         .dark-mode footer {
//             background-color: #111;
//         }
//         .dark-mode .project {
//             background-color: #333;
//             color: white;
//         }
//     `;
//     document.head.appendChild(darkModeStyle);
// });
