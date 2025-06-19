
    function showEnrollModal(courseId) {
      var modal = document.getElementById('enroll-modal-' + courseId);
      if (modal) modal.classList.add('active');
    }
    function closeModal(courseId) {
      var modal = document.getElementById('enroll-modal-' + courseId);
      if (modal) modal.classList.remove('active');
    }