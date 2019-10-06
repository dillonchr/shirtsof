(function() {
    var fname = document.getElementById('fname');
    var lname = document.getElementById('lname');
    var email = document.getElementById('email');
    var form = document.getElementById('signup');
    var btn = document.getElementById('submit');
    var notification = document.getElementById('notification');

    function updateBtnDisabled() {
        var disabled = !fname.value || !lname.value || !email.value || !email.validity.valid;
        btn.disabled = disabled;
    }

    function addDisabledToggler(elem) {
        elem.addEventListener('input', function(e) {
            updateBtnDisabled();
        });
    }

    [fname, lname, email].forEach(addDisabledToggler);

    function hideNotification() {
        notification.classList.remove('notification--visible');
    }

    function showNotification(message) {
        notification.textContent = message;
        notification.classList.add('notification--visible');
        setTimeout(hideNotification, 5000);
    }


    form.addEventListener('submit', function(e) {
        e.preventDefault();

        fetch('subscribe', {
            method: 'POST',
            headers: {
                'Accepts': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                fname: fname.value,
                lname: lname.value,
                email: email.value
            })
        })
            .then(function(r) {
                r.text()
                    .then(function(message) {
                        showNotification(r.ok ? 'We got you added! Thanks!' : message || 'Someting wong.');
                    });
            })
            .catch(function(err) {
                showNotification('Cannot contact server. Please try again or something.');
            });
    });
})();
