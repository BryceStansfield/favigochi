// Get list of filenames
function file_name_list(prefix, start_i, end_i, post_fix){
    li = []
    for(i = start_i; i <= end_i; i+=1){
        li.push(`${prefix}${i}${post_fix}`)
    }
    return li
}

//// Image Preloading
// List of images to preload
all_images = ["favs/start/StartAnim0-4.ico","favs/start/StartAnim1.ico","favs/start/StartAnim2.ico","favs/start/StartAnim3.ico","favs/start/StartAnim5.ico","favs/start/StartAnim6.ico","favs/start/StartAnim7.ico",
"favs/egg/EggBaseidle0-5-10.png","favs/egg/EggBaseidle1-4.png","favs/egg/EggBaseidle2.png","favs/egg/EggBaseidle3.png","favs/egg/EggBaseidle6-9.png","favs/egg/EggBaseidle7.png","favs/egg/EggBaseidle8.png",
"favs/trickykitty/TrickyKittyBase0.png","favs/trickykitty/TrickyKittyBaser3-1-7.png","favs/trickykitty/TrickyKittyBaser3-2-6.png","favs/trickykitty/TrickyKittyBaser3-3-5.png","favs/trickykitty/TrickyKittyBaser3-4.png",
"favs/gravestone/Gravestone-0-2.png","favs/gravestone/Gravestone-1.png","favs/gravestone/Gravestone-3.png"]

// Adding some images automatically
to_add_template = [["favs/egg/EggBasesad-",1,16,".png"], ["favs/egg/EggBasedeath-",1,8,".png"], ["favs/egg/EggBasehappy-",1,10,".png"], ["favs/egg/EggBreakingInto-",0,10,".png"],["favs/egg/EggBase-teddyBear-",1,15,".png"],
                    ["favs/trickykitty/TrickyKittyBaser1-",1,17,".png"],["favs/trickykitty/TrickyKittyBaser2-",1,12,".png"],["favs/trickykitty/TrickyKittyBaser4-",1,6,".png"], ["favs/trickykitty/TrickyKittyBaser5-",1,3,".png"], ["favs/trickykitty/TrickyKittyBaser6-",1,13,".png"], ["favs/trickykitty/TrickyKittyBaser7-",1,11,".png"], ["favs/trickykitty/TrickyKittyBase-givenFood-",1,12,".png"], ["favs/trickykitty/TrickyKittyBase-loveBombed-",1,13,".png"]]

for(e of to_add_template){
    li = file_name_list(e[0], e[1], e[2], e[3])

    for(file_name of li){
        all_images.push(file_name)
    }
}


// Image object list
im_objects = []

// Dictionary of image_names -> image_index
im_name_to_ind = {}

// Populating the list and dictionary
for(var i = 0; i < all_images.length; i+=1){
    // Populating the image list
    temp_image = new Image()
    temp_image.src = all_images[i]
    im_objects.push(temp_image)

    // Populating the dictionary
    im_name_to_ind[all_images[i].split("/")[2].split(".")[0]] = i
}


window.onload = function(){
    game_update(start=true)
    //this.animate(["StartAnim0-4","StartAnim1","StartAnim2","StartAnim3","StartAnim0-4","StartAnim5","StartAnim6","StartAnim7"],0,1000)
    //this.animate(["TrickyKittyBase0","TrickyKittyBaser1-1","TrickyKittyBaser1-2","TrickyKittyBaser1-3","TrickyKittyBaser1-4","TrickyKittyBaser1-5","TrickyKittyBaser1-6","TrickyKittyBaser1-7","TrickyKittyBaser1-8","TrickyKittyBaser1-9","TrickyKittyBaser1-10","TrickyKittyBaser1-11","TrickyKittyBaser1-12","TrickyKittyBaser1-13","TrickyKittyBaser1-14","TrickyKittyBaser1-15","TrickyKittyBaser1-16","TrickyKittyBaser1-17"],0,1000)
}

function animate(frames, cur_frame, frame_time){
    // Frame time in milliseconds

    //// Figure out if we're doing anything, and if we are, grab our images id
    if(cur_frame < frames.length){
        // Grab the appropritate image object
        image_obj = im_objects[im_name_to_ind[frames[cur_frame]]]

        // Change the favicon to that image object
        document.querySelector("link[rel*='icon']").href = image_obj.src

        // Rerun this function in frame_time milliseconds
        setTimeout(animate, frame_time, frames, cur_frame+1, frame_time)

        return
    }
    else{
        // Return to the main game loop
        game_update()
        return
    }
}

//// Globally used objects
cur_favigochi = Object()


//// Favigochi Classes
// Base Class
class Favigochi {

    constructor(button_bar){
        this.button_bar = button_bar
    }


    // Cleaning up the mess of buttons we created
    cleanup(){
        var buttons = this.button_bar.children
        for(i = 0; i < buttons.length; i += 1){
            button_bar.removeChild(buttons[i])
        }
    }

    // Changing into a new favigochi
    change_into(new_favi){
        this.cleanup()
        cur_favigochi = new new_favi()
    }

    update(){

    }
}

// Egg
class Egg extends Favigochi{
    constructor(button_bar){
        // Setting up super object
        super(button_bar)

        //// Stats!
        this.happiness = 10 // out of 10
        this.growth = 0 // out of 10

        // List of the animations this favigochi has
        this.animations = {"idle": ["EggBaseidle0-5-10", "EggBaseidle1-4", "EggBaseidle2", "EggBaseidle3", "EggBaseidle1-4", "EggBaseidle0-5-10", "EggBaseidle6-9", "EggBaseidle7", "EggBaseidle8", "EggBaseidle6-9"],
        "Sad": ["EggBaseidle0-5-10"].concat(file_name_list("EggBasesad-",1,16,"")),
        "Happy": ["EggBaseidle0-5-10"].concat(file_name_list("EggBasehappy-",1,10,"")),
        "Dying":["EggBaseidle0-5-10"].concat(file_name_list("EggBasedeath-",1,8,"")),
        "BreakingInto":file_name_list("EggBreakingInto-",0,10,""),
        "teddyBear":["EggBaseidle0-5-10"].concat(file_name_list("EggBase-teddyBear-",1,15,""))}

        //// Setting up the interaction button
        this.event_waiting = false
        this.gift_button = document.createElement("button")
        this.action_reset()
        button_bar.appendChild(this.gift_button)

        // When the button is clicked, set up the event and disabled the button
        this.gift_button.addEventListener("click",() => this.gift_button_event(), false)
        
    }

    // gift_buttton event
    gift_button_event(){
        this.disable_buttons()
        this.event_waiting = "teddyBear"
    }

    // Disable buttons after an action
    disable_buttons(){
        this.gift_button.disabled = true
        this.gift_button.innerHTML = "Waiting for Action"
    }

    // Reset buttons after an action
    action_reset(){
        this.gift_button.disabled = false
        this.gift_button.innerHTML = "Give a Gift <3"
        this.event_waiting = false
    }

    // Updating our favigochi
    update(){
        // We die if happiness is 0
        if(this.happiness <= 0){
            animate(this.animations["Dying"],0,1000)
            cur_favigochi = new GraveStone()
            return
        }
        
        // Updating our stats, we want to do this after a possible death, since that sounds sad
        this.happiness -= Math.random(0,1) <= 0.2
        this.growth += Math.random(0,1) <= 0.1


        //// Play any waiting action
        if(this.event_waiting == "teddyBear"){
            // Re-enable the buttons, turn off waiting events, update stats, and play anim
            this.action_reset()
            this.happiness = Math.min(10, this.happiness+5)
            animate(this.animations["teddyBear"],0,1000)
            return
        }

        // Evolving if our growth is >= 10
        if(this.growth >= 10){
            animate(this.animations["BreakingInto"],0,1000)
            this.change_into(TrickyKitty)
            return
        }

        // If happiness is low we are sad
        if(this.happiness <= 3){
            animate(this.animations["Sad"],0,1000)
            return
        }

        // If we're really happy, play love animation
        if(this.happiness >= 8 && Math.random(0,1) <= (Math.exp(this.happiness-10 - 1/2))){
            animate(this.animations["Happy"],0,1000)
            return
        }
        
        animate(this.animations["idle"], 0, 1000)
    }

}

// TrickyKitty
class TrickyKitty extends Favigochi{
    constructor(button_bar){
        // Setting up the super object
        super(button_bar)

        // Setting up pet variables
        this.happiness = 10;
        this.hunger = 0

        // List of the animations this favigochi has
        this.animations = {"idle1": ["TrickyKittyBase0"].concat(file_name_list("TrickyKittyBaser1-",1,17,"")),
                           "idle2": ["TrickyKittyBase0"].concat(file_name_list("TrickyKittyBaser2-",1,12,"")),
                           "love": ["TrickyKittyBase0", "TrickyKittyBaser3-1-7", "TrickyKittyBaser3-2-6", "TrickyKittyBaser3-3-5", "TrickyKittyBaser3-4", "TrickyKittyBaser3-3-5", "TrickyKittyBaser3-2-6", "TrickyKittyBaser3-1-7"],
                           "hate": ["TrickyKittyBase0"].concat(file_name_list("TrickyKittyBaser4-",1,6,"")),
                           "hungry": ["TrickyKittyBase0"].concat(file_name_list("TrickyKittyBaser5-",1,3,"")),
                           "sad": ["TrickyKittyBase0"].concat(file_name_list("TrickyKittyBaser6-",1,13,"")),
                           "dying": ["TrickyKittyBase0"].concat(file_name_list("TrickyKittyBaser7-",1,11,"")),
                           "givenFood": ["TrickyKittyBase0"].concat(file_name_list("TrickyKittyBase-givenFood-",1,12,"")),
                           "loveBombed": ["TrickyKittyBase0"].concat(file_name_list("TrickyKittyBase-loveBombed-",1,13,""))}

        //// Setting up interactions
        // Physical buttons
        this.love_button = document.createElement("button")
        this.button_bar.appendChild(this.love_button)
        this.food_button = document.createElement("button")
        this.button_bar.appendChild(this.food_button)
        this.event_waiting = false
        this.action_reset()

        this.button_bar.appendChild(this.food_button)

        // Button Events
        this.love_button.addEventListener("click",() => this.love_button_event(), false)
        this.food_button.addEventListener("click",() => this.food_button_event(), false)

    }

    //// Button Events
    food_button_event(){
        this.event_waiting = "food"
        this.disable_buttons()
    }

    love_button_event(){
        this.event_waiting = "love"
        this.disable_buttons()
    }

    // Disable buttons after an action
    disable_buttons(){
        this.love_button.disabled = true
        this.love_button.innerHTML = "Waiting for Action"
        this.food_button.disabled = true
        this.food_button.innerHTML = "Waiting for Action"
    }

    // Reset buttons after an action
    action_reset(){
        this.love_button.disabled = false
        this.love_button.innerHTML = "Share your love <3"
        this.food_button.disabled = false
        this.food_button.innerHTML = "Donate a meal"
        this.event_waiting = false
    }

    update(){
        // Dying if happiness==0 or hunger==10
        if(this.happiness==0 || this.hunger==10){
            animate(this.animations["dying"],0,1000)
            this.change_into(GraveStone)
            return
        }

        //// Updating our variables
        this.happiness -= Math.random(0,1) <= 0.05
        this.hunger += Math.random(0,1) <= 0.1

        //// Do we have a waiting event?
        if(this.event_waiting == "food"){
            this.hunger = Math.max(0, this.hunger-5)
            this.action_reset()
            animate(this.animations["givenFood"],0,1000)
            return
        }
        else if(this.event_waiting == "love"){
            this.happiness = Math.min(10, this.happiness+5)
            this.action_reset()
            animate(this.animations["loveBombed"],0,1000)
            return
        }

        //// Animations
        // Is our kitty hungry?
        if(this.hunger >= 8){
            animate(this.animations["hungry"])
        }

        // Is our kitty really happy?
        if(this.happiness >= 8 && Math.random(0,1) <= (Math.exp(this.happiness-10 - 1/2))){
            animate(this.animations["love"], 0, 1000)
            return
        }

        // Is our kitty sad?
        if(this.happiness < 3){
            animate(this.animations["sad"], 0, 1000)
            return
        }

        // Choosing our random idle animation
        if (Math.random(0,1) <= 0.5){
            animate(this.animations["idle1"], 0, 1000)
            return
        }
        else{
            animate(this.animations["idle2"], 0, 1000)
            return
        }
        
    }
}

// Gravestone
class GraveStone extends Favigochi{
    constructor(){
        // Initializing super object
        super()

        // List of the animations this favigochi has
        this.animations = {"idle": ["Gravestone-0-2", "Gravestone-1", "Gravestone-0-2", "Gravestone-3"]}
    }

    update(){
        animate(this.animations["idle"], 0, 1000)
    }
}


function game_update(start=false){
    if(start){
        cur_favigochi = new Egg(document.getElementById("button_bar"))
        animate(["StartAnim0-4","StartAnim1","StartAnim2","StartAnim3","StartAnim0-4","StartAnim5","StartAnim6","StartAnim7"],0,1000)
        return
    }
    cur_favigochi.update()
}