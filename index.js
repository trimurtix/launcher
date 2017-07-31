const fs = require('fs'),
      gm = require('gm').subClass({imageMagick: true})

const icons = [

  // iOS
  {name:"iphone_2x", size: "120x120"},
  {name: "iphone_3x", size: "180x180"},
  {name: "ipad", size: "76x76"},
  {name: "ipad_2x", size: "152x152"},
  {name: "ipad_pro", size: "167x167"},
  {name: "ios_settings", size: "29x29"},
  {name: "ios_settings_2x", size: "58x58"},
  {name: "ios_settings_3x", size: "87x87"},
  {name: "ios_spotlight", size: "40x40"},
  {name: "ios_spotlight_2x", size: "80x80"},

  // Android
  {name: "android_mdpi", size: "48x48"},
  {name: "android_hdpi", size: "72x72"},
  {name: "android_xhdpi", size: "96x96"},
  {name: "android_xxhdpi", size: "144x144"},
  {name: "android_xxxhdpi", size: "192x192"}

]

const splashes = [

  // iOS
  {"name":"iphone_2x","size":"640x960"},
  {"name":"iphone5","size":"640x1136"},
  {"name":"iphone6","size":"750x1334"},
  {"name":"iphone6p_portrait","size":"1242x2208"},
  {"name":"iphone6p_landscape","size":"2208x1242"},
  {"name":"ipad_portrait","size":"768x1024"},
  {"name":"ipad_portrait_2x","size":"1536x2048"},
  {"name":"ipad_landscape","size":"1024x768"},
  {"name":"ipad_landscape_2x","size":"2048x1536"},

  // Android
  {"name":"android_mdpi_portrait","size":"320x470"},
  {"name":"android_mdpi_landscape","size":"470x320"},
  {"name":"android_hdpi_portrait","size":"480x640"},
  {"name":"android_hdpi_landscape","size":"640x480"},
  {"name":"android_xhdpi_portrait","size":"720x960"},
  {"name":"android_xhdpi_landscape","size":"960x720"},
  {"name":"android_xxhdpi_portrait","size":"1080x1440"},
  {"name":"android_xxhdpi_landscape","size":"1440x1080"}

]

// get sizes images
const getSize = (image) => {
  let sizes = image.size.split('x')
  return { width: sizes[0], height: sizes[1] }
}

// source file, target directory, image profile
const resize = (source, target, image) => {
  let icon = gm(source)

  let imageSize = getSize(image)
  let width = imageSize.width
  let height = imageSize.height
  let name = image.name

  icon.resize(width, height)
    .write(target + name + '.png', (err) => {
      if(err) {
        console.log(err)
        console.log("Quitting because of an error")
      } else {
        console.log("Generate: " + name)
      }
    })
}

// crop images
const crop = (source, target, image) => {
  let size
  let splash = gm(source)

  let imageSize = getSize(image)
  let width = parseInt(imageSize.width)
  let height = parseInt(imageSize.height)
  let name = image.name

  // square up so that it cuts off as little as possible
  if (height > width) {
    splash.resize(height, height)

    size = height
  } else {
    splash.resize(width, width)

    size = width
  }

  // calculate x offset
  let xOffset = (size/2) - (width/2)
  let yOffset = (size/2) - (height/2)

  splash.crop(width, height, xOffset, yOffset)
    .write(target + name + '.png', (err) => {
      if(err) {
        console.log(err)
        console.log("Quitting because of an error")
      } else {
        console.log("Generate " + name)
      }
    })
}

// Run the code
if(!fs.existsSync(__dirname + '/resources/icons')) {
  fs.mkdirSync(__dirname + '/resources/icons')
}

if(!fs.existsSync(__dirname + '/resources/splashes')) {
  fs.mkdirSync(__dirname + '/resources/splashes')
}

icons.forEach(function(icon) {
  resize('resources/icon.png', 'resources/icons/', icon)
})

splashes.forEach(function(splash) {
  crop('resources/splash.png', 'resources/splashes/', splash)
})