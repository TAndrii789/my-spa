let pageUrls = {
	about: "/index.html?about",
	contact: "/index.html?contact",
	gallery: "/index.html?gallery",
};
function OnStartUp() {
	popStateHandler();
}
OnStartUp();
document.querySelector("#about-link").addEventListener("click", (event) => {
	let stateObj = { page: "about" };
	document.title = "About";
	history.pushState(stateObj, "about", "?about");
	RenderAboutPage();
});
document.querySelector("#contact-link").addEventListener("click", (event) => {
	let stateObj = { page: "contact" };
	document.title = "Contact";
	history.pushState(stateObj, "contact", "?contact");
	RenderContactPage();
});
document.querySelector("#gallery-link").addEventListener("click", (event) => {
	let stateObj = { page: "gallery" };
	document.title = "Gallery";
	history.pushState(stateObj, "gallery", "?gallery");
	RenderGalleryPage();
});
function RenderAboutPage() {
	document.querySelector("main").innerHTML = `
  <h1 class="title">About Me</h1>
  <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry...</p>`;
}
function RenderContactPage() {
	document.querySelector("main").innerHTML = `
  <h1 class="title">Contact with me</h1>
  <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry...</p>`;
}
function RenderGalleryPage() {
	document.querySelector("main").innerHTML = `
  <h1 class="title">Gallery is here</h1>
  <div id="gallery-container"></div>`;
}
function popStateHandler() {
	let loc = window.location.href.toString().split(window.location.host)[1];
	if (loc === pageUrls.contact) {
		RenderContactPage();
	}
	if (loc === pageUrls.about) {
		RenderAboutPage();
	}
	if (loc === pageUrls.gallery) {
		RenderAboutPage();
		enableInfiniteScroll();
	}
}
window.onpopstate = popStateHandler;

function RenderContactPage() {
	document.querySelector("main").innerHTML = `
		<h1 class="title">Contact with me</h1>
		<form id="contact-form">
			<label for="name">Name:</label>
			<input type="text" id="name" name="name" required> 
			<small class="error" id="name-error"></small>

			<label for="email">Email:</label>
			<input type="email" id="email" name="email" required>
			<small class="error" id="email-error"></small>

			<label for="message">Message:</label>
			<textarea id="message" name="message" required></textarea>
			<small class="error" id="message-error"></small>

			<!-- Simple CAPTCHA -->
			<label for="captcha">What is <span id="captcha-question"></span>?</label>
			<input type="text" id="captcha" name="captcha" required>
			<small class="error" id="captcha-error"></small>

			<button type="submit">Send</button>
		</form>
	`;

	const captchaQuestion = generateCaptcha();
	document.getElementById("captcha-question").textContent =
		captchaQuestion.question;

	document
		.getElementById("contact-form")
		.addEventListener("submit", (event) => {
			event.preventDefault();
			const name = document.getElementById("name").value.trim();
			const email = document.getElementById("email").value.trim();
			const message = document.getElementById("message").value.trim();
			const captchaInput = document.getElementById("captcha").value.trim();

			clearErrors();

			let isValid = true;

			if (!/^[a-zA-Z\s]+$/.test(name)) {
				showError("name-error", "Name can only contain letters and spaces.");
				isValid = false;
			}

			if (!/^[\w\.-]+@[a-zA-Z\d\.-]+\.[a-zA-Z]{2,}$/.test(email)) {
				showError("email-error", "Invalid email format.");
				isValid = false;
			}

			if (message.length < 10) {
				showError(
					"message-error",
					"Message must be at least 10 characters long."
				);
				isValid = false;
			}

			if (captchaInput != captchaQuestion.answer) {
				showError("captcha-error", "CAPTCHA answer is incorrect.");
				isValid = false;
			}

			if (isValid) {
				alert("Form submitted successfully!");
				document.getElementById("contact-form").reset();
			}
		});
}

function generateCaptcha() {
	const num1 = Math.floor(Math.random() * 10) + 1;
	const num2 = Math.floor(Math.random() * 10) + 1;
	return { question: `${num1} + ${num2}`, answer: num1 + num2 };
}

function showError(elementId, message) {
	document.getElementById(elementId).textContent = message;
}

function clearErrors() {
	document.querySelectorAll(".error").forEach((el) => (el.textContent = ""));
}

function RenderGalleryPage() {
	document.querySelector("main").innerHTML = `
			<h1 class="title">Gallery is here</h1>
			<div id="gallery-container"></div>
	`;

	addRandomImage();

	enableInfiniteScroll();
}

function addRandomImage() {
	const galleryContainer = document.getElementById("gallery-container");

	const img = document.createElement("img");
	img.src = "";
	img.dataset.src = `https://picsum.photos/1000/800?random=${Math.random()}`;
	img.loading = "lazy";
	img.alt = "Random Image";

	img.style.display = "block";
	img.style.margin = "10px auto";

	img.addEventListener("click", () => previewImage(img.dataset.src));

	observeLazyImage(img);

	galleryContainer.appendChild(img);
}

function observeLazyImage(image) {
	const observer = new IntersectionObserver((entries, observer) => {
		entries.forEach((entry) => {
			if (entry.isIntersecting) {
				image.src = image.dataset.src;
				observer.unobserve(image);
			}
		});
	});

	observer.observe(image);
}

function previewImage(imageSrc) {
	const modal = document.createElement("div");
	modal.id = "image-preview-modal";
	modal.style.position = "fixed";
	modal.style.top = "0";
	modal.style.left = "0";
	modal.style.width = "100%";
	modal.style.height = "100%";
	modal.style.backgroundColor = "rgba(0, 0, 0, 0.8)";
	modal.style.display = "flex";
	modal.style.alignItems = "center";
	modal.style.justifyContent = "center";
	modal.style.zIndex = "1000";

	const previewImg = document.createElement("img");
	previewImg.src = imageSrc;
	previewImg.style.maxWidth = "90%";
	previewImg.style.maxHeight = "90%";
	previewImg.alt = "Preview Image";

	const closeButton = document.createElement("div");
	closeButton.innerHTML = "&times;";
	closeButton.style.position = "absolute";
	closeButton.style.top = "20px";
	closeButton.style.right = "20px";
	closeButton.style.fontSize = "30px";
	closeButton.style.color = "white";
	closeButton.style.cursor = "pointer";

	closeButton.addEventListener("click", () => {
		document.body.removeChild(modal);
	});

	modal.appendChild(previewImg);
	modal.appendChild(closeButton);

	document.body.appendChild(modal);
}

function enableInfiniteScroll() {
	const scrollHandler = () => {
		const scrollTop = document.documentElement.scrollTop;
		const windowHeight = window.innerHeight;
		const scrollHeight = document.documentElement.scrollHeight;

		if (scrollTop + windowHeight >= scrollHeight - 100) {
			addRandomImage();
		}
	};

	let debounceTimeout;
	window.addEventListener("scroll", () => {
		clearTimeout(debounceTimeout);
		debounceTimeout = setTimeout(scrollHandler, 100);
	});
}

document.getElementById("theme-toggle").addEventListener("click", () => {
	document.body.classList.toggle("dark-mode");
});
