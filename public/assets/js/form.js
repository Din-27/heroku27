function submitData() {

    var name = document.getElementById('name').value
    var email = document.getElementById('email').value
    var phone = document.getElementById('phone').value
    var subject = document.getElementById('subject').value
    var message = document.getElementById('message').value

    var skillHtml = document.getElementById('skillHtml').checked

    var skillCss = document.getElementById('skillCss').checked

    if (skillHtml) {
        skillHtml = document.getElementById('skillHtml').value
    }
    else {
        skillHtml = "none"
    }


    if (skillCss) {
        skillCss = document.getElementById('skillCss').value
    } else {
        skillCss = "none"
    }

    console.log(name)
    console.log(email)
    console.log(phone)
    console.log(subject)
    console.log(message)
    console.log(skillHtml)
    console.log(skillCss)

    if (name == '')
        return alert("Nama wajib disi")

    if (email == '')
        return alert("Email wajib disi")

    if (phone == '')
        return alert("Phone wajib disi")

    if (subject == '')
    return alert("Subject wajib disi")

    if (message == '')
    return alert("Messages wajib disi")

    let emailReceiver = 'herdiyanafirmansyah27@gmail.com'

    let a = document.createElement('a')

    a.href = `mailto: ${emailReceiver}?subject${subject} &body=Hallo Nama Saya ${name} ${email} ${phone} ${subject} ${message}`
    a.click()

    var dataObject = {
        name: name,
        email: email,
        phone: phone,
        subject: subject,
        message: message,
        skillHtml: skillHtml,
        skillCss: skillCss
    }
    console.log(emailReceiver)
    console.log(dataObject);
}
