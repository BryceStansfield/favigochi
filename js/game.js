//// Main game loop
window.onload = function(){
    game_update(start=true)
}

function game_update(start=false){
    if(start){
        cur_favigochi = new Egg(new DocumentManager())
        animate(["StartAnim0-4","StartAnim1","StartAnim2","StartAnim3","StartAnim0-4","StartAnim5","StartAnim6","StartAnim7"],0,1000)
        return
    }
    else{
        cur_favigochi.update()
    }
}


//// Document manager
class DocumentManager{
    constructor(){
        // Grabbing relevant parts of the html doc
        this.favi_description_bar = document.getElementById("favi_description")
        this.favi_button_bar = document.getElementById("favi_button_bar")

        // Favi button object list
        this.favi_buttons = []
        this.favi_button_text = []
    }

    //// Favi buttons
    // Remove old favi buttons
    clear_favi_buttons(){
        // Physical buttons
        var buttons = this.favi_button_bar.children
        for(i = 0; i < buttons.length; i += 1){
            this.favi_button_bar.removeChild(buttons[i])
        }

        // Button data
        this.favi_buttons = []
        this.favi_button_text = []
    }

    // Add new favi buttons
    add_favi_buttons(...buttons){
        // button_1_text, button_1_handler, ...
        for(var i = 0; i < buttons.length/2 ; i+=1){
            // Creating physical button i
            var temp_button = document.createElement("button")
            temp_button.innerHTML = buttons[2*i]
            temp_button.addEventListener("click", buttons[2*i+1], false)
            this.favi_button_bar.appendChild(temp_button)
            this.favi_buttons.push(temp_button)

            // Adding text data to list
            this.favi_button_text.push(buttons[2*i])
        }
    }

    // Disable all favi buttons, used when an action is waiting
    disable_favi_buttons(){
        for(var i = 0; i < this.favi_buttons.length; i+= 1){
            this.favi_buttons[i].disabled = true
            this.favi_buttons[i].innerHTML = "Waiting for Action"
        }
    }

    // Reactive all favi buttons
    reactivate_favi_buttons(){
        for(var i = 0; i < this.favi_buttons.length; i+=1){
            this.favi_buttons[i].disabled = false
            this.favi_buttons[i].innerHTML = this.favi_button_text[i]
        }
    }
}