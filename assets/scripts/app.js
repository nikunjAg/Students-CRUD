const backdrop = document.getElementById("backdrop");
const addStudentModal = document.getElementById("add-modal");
const editStudentModal = document.getElementById("edit-modal");
const deleteStudentModal = document.getElementById("delete-modal");
const addStudentBtn = document.getElementById("add-student");
const template = document.querySelector("template");
const studentList = document.getElementById("student-list");
const entrySection = document.getElementById("entry-text");

class DOMHelper {
	static updateUI() {
		entrySection.classList.toggle("visible");
	}

	static toggleBackdrop() {
		backdrop.classList.toggle("visible");
	}

	static toggleAddStudentModal() {
		DOMHelper.toggleBackdrop();
		addStudentModal.classList.toggle("visible");
	}

	static toggleEditStudentModal() {
		console.log("Helo");
		DOMHelper.toggleBackdrop();
		editStudentModal.classList.toggle("visible");
	}

	static toggleDeleteStudentModal() {
		DOMHelper.toggleBackdrop();
		deleteStudentModal.classList.toggle("visible");
	}

	static toggleModalAndBackdrop() {
		if (addStudentModal.classList.contains("visible"))
			DOMHelper.toggleAddStudentModal();
		else if (editStudentModal.classList.contains("visible"))
			DOMHelper.toggleEditStudentModal();
		else DOMHelper.toggleDeleteStudentModal();
	}
}

class Student {
	constructor(id, name, email, age, gender) {
		this.id = id;
		this.name = name;
		this.email = email;
		this.age = age;
		this.gender = gender;
	}
}

const validateData = (modal) => {
	const genderList = ["", "Male", "Female"];
	const regex = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;

	const name = modal.querySelector("#name").value.trim();
	const email = modal.querySelector("#email").value.trim();
	const age = +modal.querySelector("#age").value.trim();
	const index = modal.querySelector("#gender").selectedIndex;

	console.log(name, email, age);
	if (name === "" || !regex.test(email) || age < 1 || age > 100) {
		alert("Please enter correct values");
		return null;
	}
	return { name: name, email: email, age: age, gender: genderList[index] };
};

const fillDataInModal = (student) => {
	editStudentModal.querySelector("#name").value = student.name;
	editStudentModal.querySelector("#email").value = student.email;
	editStudentModal.querySelector("#age").value = student.age;
	editStudentModal.querySelector("#gender").value = student.gender;
};

const editStudentModalHandler = (student, editSudentFn) => {
	DOMHelper.toggleEditStudentModal();
	fillDataInModal(student);
	const cancelBtn = editStudentModal.querySelector("button:last-of-type");
	cancelBtn.removeEventListener("click", DOMHelper.toggleEditStudentModal);
	cancelBtn.addEventListener("click", DOMHelper.toggleEditStudentModal);

	const updateBtn = editStudentModal.querySelector("button");
	const newUpdateBtn = updateBtn.cloneNode(true);

	updateBtn.parentElement.removeChild(updateBtn);
	editStudentModal
		.querySelector(".modal-action")
		.insertAdjacentElement("afterbegin", newUpdateBtn);
	newUpdateBtn.addEventListener("click", () => {
		const studentData = validateData(editStudentModal);
		if (!studentData) return;
		editSudentFn(
			studentData.name,
			studentData.email,
			studentData.age,
			studentData.gender
		);
		DOMHelper.toggleEditStudentModal();
	});
};

const deleteStudentModalHandler = (deleteStudentFn) => {
	DOMHelper.toggleDeleteStudentModal();
	const cancelBtn = deleteStudentModal.querySelector("button:last-of-type");
	cancelBtn.removeEventListener("click", DOMHelper.toggleDeleteStudentModal);
	cancelBtn.addEventListener("click", DOMHelper.toggleDeleteStudentModal);

	const deleteBtn = deleteStudentModal.querySelector("button");
	const newDeleteBtn = deleteBtn.cloneNode(true);

	deleteBtn.parentElement.removeChild(deleteBtn);
	deleteStudentModal
		.querySelector(".modal-action")
		.insertAdjacentElement("afterbegin", newDeleteBtn);
	newDeleteBtn.addEventListener("click", () => {
		deleteStudentFn();
		DOMHelper.toggleDeleteStudentModal();
	});
};

class StudentItem {
	constructor(student) {
		this.student = student;
		this.render();
	}

	editStudent = (name, email, age, gender) => {
		this.student.name = name;
		this.student.email = email;
		this.student.age = age;
		this.student.gender = gender;
		this.studentDOM.querySelector("h2").textContent = this.student.name;
		this.studentDOM.querySelector(".email").textContent = this.student.email;
		this.studentDOM.querySelector(".age").textContent = this.student.age;
		const genderEl = this.studentDOM.querySelector(".gender");
		genderEl.parentElement.style.display = "block";

		if (this.student.gender !== "") genderEl.textContent = this.student.gender;
		else genderEl.parentElement.style.display = "none";
	};

	editStudentHandler() {
		editStudentModalHandler(this.student, this.editStudent);
	}

	deleteStudent = () => {
		App.deleteStudent(this.student.id);
		this.studentDOM.parentElement.removeChild(this.studentDOM);
	};

	deleteStudentHandler() {
		deleteStudentModalHandler(this.deleteStudent);
	}

	render() {
		const studentDOM = document.importNode(template.content, true);
		studentDOM.querySelector("h2").textContent = this.student.name;
		studentDOM.querySelector(".email").textContent = this.student.email;
		studentDOM.querySelector(".age").textContent = this.student.age;

		const gender = studentDOM.querySelector(".gender");

		if (this.student.gender !== "") gender.textContent = this.student.gender;
		else gender.parentElement.style.display = "none";

		studentDOM
			.querySelector("button")
			.addEventListener("click", this.editStudentHandler.bind(this));
		studentDOM
			.querySelector("button:last-of-type")
			.addEventListener("click", this.deleteStudentHandler.bind(this));
		this.studentDOM = studentDOM.querySelector("li");
		studentList.appendChild(studentDOM);
	}
}

class StudentList {
	#students = [];
	constructor() {
		this.fetchStudents();
	}

	fetchStudents() {
		this.#students = [
			new Student(
				Math.random(),
				"Nikunj Aggarwal",
				"nik@gmail.com",
				"20",
				"Male"
			),
			new Student(
				Math.random(),
				"Test Recipe!",
				"test@gmail.com",
				"23",
				"Male"
			),
		];
		if (this.#students.length > 0) DOMHelper.updateUI();
		this.renderStudents();
	}

	renderStudent(student) {
		new StudentItem(student);
	}

	renderStudents() {
		this.#students.forEach(this.renderStudent);
	}

	addStudent(name, email, age, gender) {
		this.#students.push(new Student(Math.random(), name, email, age, gender));
		if (this.#students.length == 1) DOMHelper.updateUI();
		this.renderStudent(this.#students[this.#students.length - 1]);
	}

	deleteStudent(studentId) {
		this.#students = this.#students.filter(
			(student) => student.id !== studentId
		);
		if (this.#students.length === 0) DOMHelper.updateUI();
	}
}

class App {
	static studentList;
	static init() {
		this.studentList = new StudentList();
	}

	static addStudent(name, email, age, gender) {
		App.studentList.addStudent(name, email, age, gender);
	}

	static deleteStudent(studentId) {
		App.studentList.deleteStudent(studentId);
	}
}

App.init();

const addStudentHandler = () => {
	const studentData = validateData(addStudentModal);
	if (!studentData) return;
	App.addStudent(
		studentData.name,
		studentData.email,
		studentData.age,
		studentData.gender
	);
	addStudentModal.querySelector("#name").value = "";
	addStudentModal.querySelector("#email").value = "";
	addStudentModal.querySelector("#age").value = "";
	addStudentModal.querySelector("#gender").selectedIndex = 0;
	DOMHelper.toggleAddStudentModal();
};

// Add Student Modal
addStudentBtn.addEventListener("click", DOMHelper.toggleAddStudentModal);
addStudentModal
	.querySelector("button")
	.addEventListener("click", addStudentHandler);
addStudentModal
	.querySelector("button:last-of-type")
	.addEventListener("click", DOMHelper.toggleAddStudentModal);
backdrop.addEventListener("click", DOMHelper.toggleModalAndBackdrop);
