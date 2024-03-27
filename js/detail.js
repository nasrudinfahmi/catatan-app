const noteWrapperElement = document.querySelector(".note-wrapper");
const footer = document.getElementById("footer");

const id = getQuery("id");
const allNotes = getAllNotes();
const note = allNotes.find((note) => note.id === id);

document.addEventListener("DOMContentLoaded", () => {
  footer.innerHTML = footerChilds();

  if (!note) {
    noteWrapperElement.innerHTML = notFoundElement();
  } else {
    noteWrapperElement.innerHTML = createDetailNote({
      id: note.id,
      title: note.title,
      textNote: note.textNote,
      date: note.createdAt,
    });
  }
});

noteWrapperElement.addEventListener("click", (e) => {
  const target = e.target;
  const deleteButton = target.closest(".btn-delete");
  const archiveButton = target.closest(".btn-archive");
  const editButton = target.closest(".btn-edit");

  if (deleteButton) {
    const isConfirmed = confirm("Yakin ingin menghapus catatan ini?");

    if (!isConfirmed) return;

    handleDeleteNote(id);
    window.history.back();
  }

  if (archiveButton) {
    if (!note.isArchived) {
      handleArchiveNote(id);
      window.location.href = "arsip.html";
    } else {
      handleUnArchiveNote(id);
      window.location.href = "/";
    }
  }

  if (editButton) {
    window.location.href = `tambah.html?id=${id}`;
  }
});
