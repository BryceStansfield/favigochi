//// Globally used objects
cur_favigochi = Object()


//// Favigochi Classes
// Base Class
class Favigochi {

    constructor(document_manager){
        // What exists in all favigochis?
        this.document_manager = document_manager
        this.event_waiting = false
        this.frame_delta = 0
    }

    //// Button Stuff
    // disable all buttons
    disable_buttons(){
        this.document_manager.disable_favi_buttons()
    }

    // Cleanup residual global data
    cleanup(){
        this.document_manager.clear_favi_buttons()
    }

    // Reset buttons and waiting event
    action_reset(){
        this.event_waiting=false
        this.document_manager.reactivate_favi_buttons()
    }

    // Button event template
    queue_event(name){
        return () => {
            this.disable_buttons()
            this.event_waiting = name
        }; 
    }


    //// Other Stuff
    // Changing into a new favigochi
    change_into(new_favi){
        console.log("CHANGE INTO")
        this.cleanup()
        cur_favigochi = new new_favi(this.document_manager)
    }  

    // Animate and updating frame deltas
    play_anim(animation, millisecs_per_frame){
        this.frame_delta = animation.length
        animate(animation,0,millisecs_per_frame)
    }

    // Game state update
    update(){

    }
}

// Egg
class Egg extends Favigochi{
    constructor(document_manager){
        // Setting up super object
        super(document_manager)

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
        this.document_manager.add_favi_buttons("Give a Gift <3", this.queue_event("teddyBear"))
    }

    // Updating our favigochi
    update(){
        // We die if happiness is 0
        if(this.happiness <= 0){
            this.play_anim(this.animations["Dying"],1000)
            cur_favigochi = new GraveStone()
            return
        }
        
        // Updating our stats, we want to do this after a possible death, since that sounds sad
        this.update_stats()

        //// Play any waiting action
        if(this.event_waiting == "teddyBear"){
            // Re-enable the buttons, turn off waiting events, update stats, and play anim
            this.action_reset()
            this.happiness = Math.min(10, this.happiness+5)
            this.play_anim(this.animations["teddyBear"],1000)
            return
        }

        // Evolving if our growth is >= 10
        if(this.growth >= 10){
            this.play_anim(this.animations["BreakingInto"],1000)
            this.change_into(TrickyKitty)
            return
        }

        // If happiness is low we are sad
        if(this.happiness <= 3){
            this.play_anim(this.animations["Sad"],1000)
            return
        }

        // If we're really happy, play love animation
        if(this.happiness >= 8 && Math.random(0,1) <= (Math.exp(this.happiness-10 - 1/2))){
            this.play_anim(this.animations["Happy"],1000)
            return
        }
        
        this.play_anim(this.animations["idle"], 1000)
    }

    // Update stats using a frame delta
    update_stats(){
        // TODO: Update to use normal approximations
        for(var i = 0; i <= this.frame_delta; i+=1){
            // Change by Math.random() <= 1/expected_time_to_change
            this.happiness -= Math.random() <= 1/360
            this.growth += Math.random() <= 1/720
        }
    }

}

// TrickyKitty
class TrickyKitty extends Favigochi{
    constructor(document_manager){
        // Setting up the super object
        super(document_manager)

        // Setting up pet variables
        this.happiness = 10;
        this.hunger = 0
        this.skill = 0

        // Some extra event handling
        this.currently_shooting = [0]

        // List of the animations this favigochi has
        this.animations = {"idle1": ["TrickyKittyBase0"].concat(file_name_list("TrickyKittyBaser1-",1,17,"")),
                           "idle2": ["TrickyKittyBase0"].concat(file_name_list("TrickyKittyBaser2-",1,12,"")),
                           "love": ["TrickyKittyBase0", "TrickyKittyBaser3-1-7", "TrickyKittyBaser3-2-6", "TrickyKittyBaser3-3-5", "TrickyKittyBaser3-4", "TrickyKittyBaser3-3-5", "TrickyKittyBaser3-2-6", "TrickyKittyBaser3-1-7"],
                           "hate": ["TrickyKittyBase0"].concat(file_name_list("TrickyKittyBaser4-",1,6,"")),
                           "hungry": ["TrickyKittyBase0"].concat(file_name_list("TrickyKittyBaser5-",1,3,"")),
                           "sad": ["TrickyKittyBase0"].concat(file_name_list("TrickyKittyBaser6-",1,13,"")),
                           "dying": ["TrickyKittyBase0"].concat(file_name_list("TrickyKittyBaser7-",1,11,"")),
                           "givenFood": ["TrickyKittyBase0"].concat(file_name_list("TrickyKittyBase-givenFood-",1,12,"")),
                           "loveBombed": ["TrickyKittyBase0"].concat(file_name_list("TrickyKittyBase-loveBombed-",1,13,"")),
                           "shooting":{}}
        
        // Shooting Animations
        this.animations["shooting"][1] = {1:{},2:{},3:{}}
        for(var i = 1; i <= 3; i += 1){
            this.animations["shooting"][1][i] = {
                "hit":file_name_list(`TrickyKittyBase-targetShooting(1-${i})-hit-`,1,4,""),
                "miss":file_name_list(`TrickyKittyBase-targetShooting(1-${i})-hit-`,1,4,"")
            }
        }
        this.animations["shooting"][2] = {
            "3hits":file_name_list("TrickyKittyBase-targetShooting2-3hits-",1,6,""),
            "1hit":file_name_list("TrickyKittyBase-targetShooting2-1hit-",1,6,""),
            "miss":file_name_list("TrickyKittyBase-targetShooting2-miss-",1,6,"")
        }

        this.animations["shooting"][3] = {
            "hit":file_name_list("TrickyKittyBase-targetShooting3-hit-",1,7,""),
            "minihit":file_name_list("TrickyKittyBase-targetShooting3-minihit-",1,7,""),
            "miss":file_name_list("TrickyKittyBase-targetShooting3-miss-",1,7,"")
        }


        //// Setting up interactions
        this.document_manager.add_favi_buttons("Share your love <3", this.queue_event("love"), "Donate a meal", this.queue_event("food"), "Practice target shooting", this.queue_event("shooting"))

    }

    update(){
        // Dying if happiness==0 or hunger==10
        if(this.happiness==0 || this.hunger==10){
            this.play_anim(this.animations["dying"],1000)
            this.change_into(GraveStone)
            return
        }

        //// Updating our variables
        this.update_stats()

        // Are we currently shooting or going to start shooting?
        if(this.event_waiting == "shooting"){
            this.event_waiting = false
            this.action_reset()
            this.shooting_manager()
            return
        }
        else if (this.currently_shooting[0] == 1 || this.currently_shooting[0] == 2){
            this.shooting_manager()
            return        
        }
        else if (this.currently_shooting[0] == 3){
            this.currently_shooting = [0]
        }


        //// Do we have a waiting event?
        if(this.event_waiting == "food"){
            this.hunger = Math.max(0, this.hunger-5)
            this.action_reset()
            this.play_anim(this.animations["givenFood"],1000)
            return
        }
        else if(this.event_waiting == "love"){
            this.happiness = Math.min(10, this.happiness+5)
            this.action_reset()
            this.play_anim(this.animations["loveBombed"],1000)
            return
        }

        //// Animations
        // Is our kitty hungry?
        if(this.hunger >= 8){
            this.play_anim(this.animations["hungry"],1000)
        }

        // Is our kitty really happy?
        if(this.happiness >= 8 && Math.random(0,1) <= (Math.exp(this.happiness-10 - 1/2))){
            this.play_anim(this.animations["love"], 1000)
            return
        }

        // Is our kitty sad?
        if(this.happiness < 3){
            this.play_anim(this.animations["sad"], 1000)
            return
        }

        // Choosing our random idle animation
        if (Math.random(0,1) <= 0.5){
            this.play_anim(this.animations["idle1"], 1000)
            return
        }
        else{
            this.play_anim(this.animations["idle2"], 1000)
            return
        }
    }

    // Update stats using a frame delta
    update_stats(){
        // TODO: Update to use normal approximations
        for(var i = 0; i <= this.frame_delta; i+=1){
            // Change by Math.random() <= 1/expected_time_to_change
            this.happiness -= Math.random() <= 1/1080
            this.hunger += Math.random() <= 1/1080

            if(this.skill >= 3){
                this.skill = Math.max(this.skill - Math.random()/1080, 3)
            }
        }
    }

    // Shooting Manager
    shooting_manager(){
        //// Basically just a massive state tree
        console.log(this.currently_shooting)
        // Updating the shooting state, a massive mess
        if(this.currently_shooting[0] == 0){
            this.currently_shooting = [1,1]
            if(Math.random() <= 1/4 + this.skill/4){
                this.play_anim(this.animations["shooting"][1][1]["hit"], 1000)
            }
            else{
                this.play_anim(this.animations["shooting"][1][1]["miss"], 1000)
            }
        }
        else if(this.currently_shooting[0] == 1){
            if(this.currently_shooting[1] == 3){
                this.currently_shooting = [2]
                if(Math.random() <= 1/8 + this.skill/8){
                    this.play_anim(this.animations["shooting"][2]["3hits"], 1000)
                }
                else if(Math.random() <= 1/8 + this.skill/8){
                    this.play_anim(this.animations["shooting"][2]["1hit"], 1000)
                }
                else{
                    this.play_anim(this.animations["shooting"][2]["miss"], 1000)
                }
            }
            else{
                this.currently_shooting = [1, this.currently_shooting[1]+1]
                if(Math.random() <= 1/6 + this.skill/6){
                    this.play_anim(this.animations["shooting"][1][this.currently_shooting[1]]["hit"], 1000)
                }
                else{
                    this.play_anim(this.animations["shooting"][1][this.currently_shooting[1]]["miss"], 1000)
                }
            }
        }
        else{
            this.currently_shooting = [3]
            if(Math.random <= 1/15 + this.skill/15){
                this.play_anim(this.animations["shooting"][3]["hit"], 1000)
            }
            else if(Math.random <= 1/8 + this.skill/8){
                this.play_anim(this.animations["shooting"][3]["minihit"], 1000)
            }
            else{
                this.play_anim(this.animations["shooting"][3]["miss"], 1000)
            }
        }

        // Finally, updating out skill level
        this.skill = Math.min(this.skill + 0.2, 10)
        return
    }
}

// Gravestone
class GraveStone extends Favigochi{
    constructor(document_manager){
        // Initializing super object
        super(document_manager)

        // List of the animations this favigochi has
        this.animations = {"idle": ["Gravestone-0-2", "Gravestone-1", "Gravestone-0-2", "Gravestone-3"]}
    }

    update(){
        this.play_anim(this.animations["idle"], 1000)
    }
}