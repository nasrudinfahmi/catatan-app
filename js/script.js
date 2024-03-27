const noteWrapperElement = document.querySelector(".note-wrapper");
const inputSearch = document.getElementById("search");
const footer = document.getElementById("footer");

noteWrapperElement.addEventListener("click", (e) => {
  const target = e.target;
  const deleteButton = target.closest(".btn-delete");
  const archiveButton = target.closest(".btn-archive");

  if (deleteButton) {
    onDeleteNote(target, false, noteWrapperElement);
  }

  if (archiveButton) {
    onArchiveNote(target, false, noteWrapperElement);
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const titleValue = getQuery("title");
  renderNoteCard(false, noteWrapperElement);

  footer.innerHTML = footerChilds();
  if (titleValue) inputSearch.value = titleValue;
});

inputSearch.addEventListener("input", (e) => {
  const notes = getNotes(false);
  handleInputSearch(e, notes);
});
