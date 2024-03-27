const title = document.querySelector(".title");
const btnAddNote = document.getElementById("btn-submit");
const titleInput = document.querySelector(".title-input");
const bodyNote = document.getElementById("body-note");
const archiveCheckboxElement = document.getElementById("isArchived");
const footer = document.getElementById("footer");

const id = getQuery("id");
const allNotes = getAllNotes();
const note = allNotes.find((note) => note.id === id);

document.addEventListener("DOMContentLoaded", () => {
  footer.innerHTML = footerChilds();

  if (id && note) {
    title.innerText = "Edit Catatan";
    btnAddNote.innerText = "Terapkan Perubahan";
    titleInput.value = note.title;
    bodyNote.innerHTML = note.textNote;
    archiveCheckboxElement.checked = note.isArchived;
  }
});

btnAddNote.addEventListener("click", () => {
  const title = titleInput.value?.trim();
  const textNote = bodyNote.innerHTML;
  const isArchived = archiveCheckboxElement.checked;

  if (title === "" || bodyNote.innerText.trim() === "") {
    return alert("Catatan tidak valid!");
  }

  if (id && note) editNote({ id, title, textNote, isArchived });
  else saveNote({ title, textNote, isArchived });

  isArchived
    ? (window.location.href = "arsip.html")
    : (window.location.href = "/");
});
