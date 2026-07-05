window.addEventListener('load', function () {
      setTimeout(function () {
        const modal = new bootstrap.Modal(document.getElementById('myModal'));
        modal.show();
      }, 3000); // 3000ms = 3 seconds
    });