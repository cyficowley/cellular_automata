export function modularPadArray(prePadArray, border){  // buffer should be input tile radius

    var ppa = prePadArray
    var b   = border
    
    // 9 parts, original array in center, 4 sides, 4 corners
    
    var botSlice   = ppa.slice([ppa.shape[0]-b,ppa.shape[0]])
    var topSlice   = ppa.slice([             0,           b])
    
    var rightSlice = ppa.slice(null, [ppa.shape[1]-b,ppa.shape[1]])
    var leftSlice  = ppa.slice(null, [             0,           b])
    
    var topLeftCor   = ppa.slice([             0,           b],[             0,           b])
    var topRightCor  = ppa.slice([             0,           b],[ppa.shape[1]-b,ppa.shape[1]])
    var botLeftCor   = ppa.slice([ppa.shape[0]-b,ppa.shape[0]],[             0,           b])
    var botRightCor  = ppa.slice([ppa.shape[0]-b,ppa.shape[0]],[ppa.shape[1]-b,ppa.shape[1]])
   
    console.log(botRightCor.shape)
    console.log(botSlice.shape)
    
    var topPad = nj.concatenate( nj.concatenate( botRightCor, botSlice), botLeftCor)
    var midPad = nj.concatenate( nj.concatenate(   rightSlice,      ppa), leftSlice) 
    var botPad = nj.concatenate( nj.concatenate( topRightCor, topSlice), topLeftCor) 
    
    var padded  = nj.concatenate(nj.concatenate(topPad.T, midPad.T), botPad.T).T
    
    return padded //console.log(padded)

}