favilib = new FaviLib()

//// Load files
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
                    ["favs/trickykitty/TrickyKittyBaser1-",1,17,".png"],["favs/trickykitty/TrickyKittyBaser2-",1,12,".png"],["favs/trickykitty/TrickyKittyBaser4-",1,6,".png"], ["favs/trickykitty/TrickyKittyBaser5-",1,3,".png"], ["favs/trickykitty/TrickyKittyBaser6-",1,13,".png"], ["favs/trickykitty/TrickyKittyBaser7-",1,11,".png"], ["favs/trickykitty/TrickyKittyBase-givenFood-",1,12,".png"], ["favs/trickykitty/TrickyKittyBase-loveBombed-",1,13,".png"],
                    ["favs/trickykitty/TrickyKittyBase-targetShooting(1-1)-hit-",1,4,".png"],["favs/trickykitty/TrickyKittyBase-targetShooting(1-2)-hit-",1,4,".png"],["favs/trickykitty/TrickyKittyBase-targetShooting(1-3)-hit-",1,4,".png"],["favs/trickykitty/TrickyKittyBase-targetShooting(1-1)-miss-",1,4,".png"],["favs/trickykitty/TrickyKittyBase-targetShooting(1-2)-miss-",1,4,".png"],["favs/trickykitty/TrickyKittyBase-targetShooting(1-2)-miss-",1,4,".png"],
                    ["favs/trickykitty/TrickyKittyBase-targetShooting2-1hit-",1,6,".png"],["favs/trickykitty/TrickyKittyBase-targetShooting2-3hits-",1,6,".png"],["favs/trickykitty/TrickyKittyBase-targetShooting2-miss-",1,6,".png"],
                    ["favs/trickykitty/TrickyKittyBase-targetShooting3-hit-",1,7,".png"],["favs/trickykitty/TrickyKittyBase-targetShooting3-minihit-",1,7,".png"],["favs/trickykitty/TrickyKittyBase-targetShooting3-miss-",1,7,".png"]]


for(e of to_add_template){
    li = file_name_list(e[0], e[1], e[2], e[3])

    for(file_name of li){
        all_images.push(file_name)
    }
}

// Populating the list and dictionary
favilib.load_uris(all_images, all_images.map(x => {
    split_arr = x.split('/')
    return split_arr[split_arr.length - 1].split('.')[0]
}))

//// Animation
function animate(frames, cur_frame, frame_time){
    // Frame time in milliseconds

    //// Figure out if we're doing anything, and if we are, grab our images id
    if(cur_frame < frames.length){
        favilib.update_from_uri(frames[cur_frame])

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