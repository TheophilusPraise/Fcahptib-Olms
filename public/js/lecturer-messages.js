
    document.addEventListener('DOMContentLoaded', () => {
      const tabs = document.querySelectorAll('.tab');
      const panels = document.querySelectorAll('.panel');

      tabs.forEach(tab => {
        tab.addEventListener('click', () => {
          tabs.forEach(t => t.classList.remove('active'));
          panels.forEach(p => p.style.display = 'none');
          tab.classList.add('active');
          document.getElementById(tab.dataset.tab).style.display = 'block';
        });
      });

      // When user selects a private chat from list, update hidden recipientId input
      document.querySelectorAll('#private-list li').forEach(li => {
        li.addEventListener('click', () => {
          const recipientId = li.dataset.chatId;
          document.getElementById('private-recipient-id').value = recipientId;
          // Optionally highlight selected chat
          document.querySelectorAll('#private-list li').forEach(el => el.classList.remove('active'));
          li.classList.add('active');
        });
      });

      // Voice note and video call button placeholders
      document.querySelectorAll('.voice-video-buttons button').forEach(button => {
        button.addEventListener('click', () => {
          alert(`Feature "${button.title}" is not implemented yet.`);
        });
      });
    });


    document.addEventListener('DOMContentLoaded', () => {
  const tabs = document.querySelectorAll('.tab');
  const panels = document.querySelectorAll('.panel');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      panels.forEach(p => p.style.display = 'none');
      tab.classList.add('active');
      document.getElementById(tab.dataset.tab).style.display = 'block';
      console.log(`Switched to tab: ${tab.dataset.tab}`);
    });
  });

  // Log private message form submission
  const privateForm = document.getElementById('private-message-form');
  if (privateForm) {
    privateForm.addEventListener('submit', e => {
      const recipientId = privateForm.querySelector('input[name="recipientId"]').value;
      const content = privateForm.querySelector('input[name="content"]').value;
      console.log(`Sending private message to recipientId=${recipientId}: "${content}"`);
    });
  }

  // Log group message form submission
  const groupForm = document.getElementById('group-message-form');
  if (groupForm) {
    groupForm.addEventListener('submit', e => {
      const groupId = groupForm.querySelector('input[name="groupId"]').value;
      const content = groupForm.querySelector('input[name="content"]').value;
      console.log(`Sending group message to groupId=${groupId}: "${content}"`);
    });
  }

  // Voice note and video call button handlers with logging
  document.querySelectorAll('.voice-video-buttons button').forEach(button => {
    button.addEventListener('click', () => {
      const action = button.title.toLowerCase();
      console.log(`User triggered action: ${action}`);
      alert(`Feature "${button.title}" is not implemented yet.`);
    });
  });

  // Log user selection in private chat list
  document.querySelectorAll('#private-list li').forEach(li => {
    li.addEventListener('click', () => {
      const recipientId = li.dataset.chatId;
      console.log(`Selected private chat with userId=${recipientId}`);
      document.getElementById('private-recipient-id').value = recipientId;
      document.querySelectorAll('#private-list li').forEach(el => el.classList.remove('active'));
      li.classList.add('active');
    });
  });

  // Log user selection in group list
  document.querySelectorAll('#group-list li').forEach(li => {
    li.addEventListener('click', () => {
      const groupId = li.dataset.groupId;
      console.log(`Selected group chat with groupId=${groupId}`);
      document.getElementById('group-id').value = groupId;
      document.querySelectorAll('#group-list li').forEach(el => el.classList.remove('active'));
      li.classList.add('active');
    });
  });
});

