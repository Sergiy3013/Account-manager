var li = document.querySelectorAll('.content li:not(.new_service)')
// el.preventDefault();

function servicesPage() {
    var add_service = document.querySelector(".new_service .btns .yes")
    var cancel_service = document.querySelector(".new_service .btns .no")

    var service_edit_mod = false;
    var old_service_link = "";

    // Preview the image
    document.querySelector(".new_service .inputs #img_link").onchange = function () {
        if (document.querySelector(".new_service .inputs #img_link").value.trim() == "") {
            document.querySelector(".new_service #img_preview").src = "/img/no_img.jpg"
        } else {
            document.querySelector(".new_service #img_preview").src = document.querySelector(".new_service .inputs #img_link").value.trim();
        }
    }
    // Add button
    add_service.onclick = function () {
        var inputs = document.querySelector(".new_service .inputs")
        var key = document.querySelector(".new_service .inputs")

        var data = {
            title: inputs.querySelector("#title").value.trim(),
            old_link: old_service_link,
            link: inputs.querySelector("#code").value.trim(),
            icon: inputs.querySelector("#img_link").value.trim() || window.location.protocol + "//" + window.location.host + "/img/no_img.jpg"
        }
        if (data.title == "" || data.code == "") {
            alert('The "Name" and "Code" fields are mandatory!')
            return
        } else if (codes.includes(data.code) && !service_edit_mod) {
            alert("This code is already in use!")
            return
        } else {
            var post_url = "/services/add/";
            if (service_edit_mod) post_url = "/services/edit/";
            sendJSON(post_url, data)
            alert("Data sent!")
        }
    }
    // Cancel button
    cancel_service.onclick = function () {
        document.querySelectorAll(".new_service input").forEach(el => {
            el.value = "";
        });
        document.querySelector(".new_service #img_preview").src = "/img/no_img.jpg";
        service_edit_mod = false;
    }

    li.forEach(el => {
        var li_key = el.title;

        // View
        el.querySelector(".info").onclick = function () {
            el.querySelector(".control #view").click();
        }

        // Change
        el.querySelector(".control #edit").onclick = function () {
            if (confirm(`Change the service "${el.querySelector(".info p").innerText}"?`)) {
                var inputs = document.querySelector(".new_service .inputs")
                inputs.querySelector("#title").value = el.querySelector(".info p").innerText;
                inputs.querySelector("#code").value = el.title;
                inputs.querySelector("#img_link").value = el.querySelector(".info img").src;
                document.querySelector(".new_service img").src = el.querySelector(".info img").src;
                old_service_link = el.title;
                service_edit_mod = true;
            }
        }
        // Delete
        el.querySelector(".control #delete").onclick = function () {
            if (confirm(`Remove the service "${el.querySelector(".info p").innerText}"?`)) {
                sendJSON("/services/remove/", { link: li_key })
            }
        }
    });

    document.querySelector('.content li.new_service .main').style.height = '160px';
}

function servicePage() {
    var add_acc = document.querySelector(".new_service .btns .yes")
    var cancel_acc = document.querySelector(".new_service .btns .no")
    var inputs = document.querySelector(".new_service")
    var stat = document.querySelector(".new_service input#status")
    var comment = document.querySelector(".new_service textarea")

    var acc_view = false;
    var acc_edit = false;

    add_acc.onclick = async function () {
        var login = inputs.querySelector("#login").value;
        var pass = inputs.querySelector("#pass").value;
        var key = inputs.querySelector("#crypt_key").value;
        var status = stat.checked;
        var comm = comment.value.trim();
        var data = {
            login,
            pass,
            key,
            stat: status,
            comment: comm
        }
        // Add account
        if (!acc_view && !acc_edit) {
            console.log(login, pass, key);
            sendJSON(document.URL.split('#')[0] + "/add/", data)
        }
        // View account
        if (acc_view && !acc_edit) {
            var res = await fetch(document.location.origin + `/pass/${pass}/${key}/`)
            .then((response) => {
                return response.json();
            })
            if (res.pass) inputs.querySelector("#pass").value = res.pass;
            else return;
            console.log(res);
            var id = document.querySelector('li.new_service').value;
            document.querySelector(`li:not(.new_service)[value="${id}"]`).querySelector('#pass').value = res.pass;
        }
        // Change account
        if (!acc_view && acc_edit) {
            console.log(login, pass, key);
            sendJSON(document.URL.split('#')[0] + "/update/", data)
        }
    }

    cancel_acc.onclick = function () {
        document.querySelectorAll(".new_service input").forEach(el => {
            el.value = "";
            el.disabled = false;
        });
        document.querySelector(".new_service textarea").disabled = false;
        document.querySelector(".new_service textarea").value = "";

        service_edit_mod = false;
        acc_view = false;
        acc_edit = false;
        document.querySelector(".new_service").value = null;
        document.querySelector("#crypt_key").value = "";
        document.querySelector(".new_service input#status").checked = true;
    }


    li.forEach(el => {
        // View
        el.querySelector(".control #view").onclick = function () {
            document.querySelector(".new_service").value = el.value;

            acc_view = true;
            var login_input = document.querySelector(".new_service .inputs #login");
            var pass_input = document.querySelector(".new_service .inputs #pass");

            login_input.disabled = true;
            pass_input.disabled = true;
            comment.disabled = true;

            login_input.value = el.querySelector(".info #login").value;
            pass_input.value = el.querySelector(".info #pass").value;
            stat.checked = el.querySelector("input#status").checked;
            comment.value = el.querySelector("textarea").value;
        }

        // Change
        el.querySelector(".control #edit").onclick = function () {
            if (confirm(`Change account data "${el.querySelector(".info p #login").value}"?`)) {
                acc_edit = true;
                var login_input = document.querySelector(".new_service .inputs #login");
                var pass_input = document.querySelector(".new_service .inputs #pass");
                document.querySelector(".new_service").value = el.value;

                login_input.disabled = true;
                pass_input.disabled = false;
                comment.disabled = false;

                login_input.value = el.querySelector(".info #login").value;
                pass_input.value = el.querySelector(".info #pass").value;
                stat.checked = el.querySelector("input#status").checked;
                comment.value = el.querySelector("textarea").value;
            }
        }

        // Delete
        el.querySelector(".control #delete").onclick = function () {
            if (confirm(`Delete the account "${el.querySelector(".info p #login").value}"?`)) {
                sendJSON(document.URL.split('#')[0] + "/remove/", { id: el.value, login: el.querySelector(".info #login").value })
            }
        }
    });
}



function sendJSON(url, data) {
    if (!url || !data) return false
    var xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    var data = JSON.stringify(data);
    xhr.send(data);
    reload();
    return true
}

async function sendJSON_Res(url, data) {
    if (!url || !data) return false
    var req = await fetch(url, {
        method: 'post', // Default is 'get'
        body: JSON.stringify(data),
        mode: 'cors',
        headers: new Headers({
            'Content-Type': 'application/json'
        })
    })
    var result = await req.json() || false;
    return result
}
function reload(time = 500) {
    setTimeout(function () { location.reload(true); }, time);
}