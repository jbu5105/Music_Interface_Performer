/**
 this Processing sketch receives data from the whrist with Posenet
 and sends three different MIDI signals
 */
 
 //--------------------------- Libraries ----------------------------------//
import oscP5.*;
import netP5.*;
import themidibus.*;

//----------------------------- Objects -----------------------------------//
OscP5 oscP5;
NetAddress myRemoteLocation;
MidiBus MIDI;

//---------------------- Variable initialization --------------------------//
int w = 720;
int h = 480;

float xR = 0;
float xL = 0;
float yR = 0;
float yR_midi = 0;
float yL = 0;
float yL_midi = 0;

int status = 176;



void setup() {
  oscP5 = new OscP5(this, 3334);
  myRemoteLocation = new NetAddress("127.0.0.1", 12000);

  MIDI = new MidiBus(this, "loopMIDI Port", "loopMIDI Port");
}


void draw() {
  
}

// OSC reading and MIDI sending
void oscEvent(OscMessage theOscMessage) {
  
   if(theOscMessage.checkAddrPattern("/XrightWrist")==true){
     xR = theOscMessage.get(0).floatValue();   
     
     if(yR > h) yR = h;
     
     if(xR < w/3){
         yR_midi = map(yR,0,h,126,0);
         MIDI.sendMessage(status,1,int(yR_midi));
     }else if((xR >= w/3) && (xR < 2*w/3)){
         yR_midi = map(yR,0,h,126,0);
         MIDI.sendMessage(status,2,int(yR_midi));      
     }else {
         yR_midi = map(yR,0,h,126,0);
         MIDI.sendMessage(status,3,int(yR_midi));      
     }
     
   }else if(theOscMessage.checkAddrPattern("/YrightWrist")==true){
     yR = theOscMessage.get(0).floatValue();
    
   }else if (theOscMessage.checkAddrPattern("/XleftWrist")==true){
     xL = theOscMessage.get(0).floatValue();

     if(yL > h) yL = h;
     
     if(xL < w/3){
         yL_midi = map(yL,0,h,126,0);
         MIDI.sendMessage(status,1,int(yL_midi));
     }else if((xL >= w/3) && (xL < 2*w/3)){
         yL_midi = map(yL,0,h,126,0);
         MIDI.sendMessage(status,2,int(yL_midi));      
     }else {
         yL_midi = map(yL,0,h,126,0);
         MIDI.sendMessage(status,3,int(yL_midi));      
     }
     
   }else if(theOscMessage.checkAddrPattern("/YleftWrist")==true){
     yL = theOscMessage.get(0).floatValue();
   }
      
}
