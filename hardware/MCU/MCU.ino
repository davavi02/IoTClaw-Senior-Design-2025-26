const int coinPin =0;
const int fwdPin1 =1;
const int backPin2 =2;
const int rightPin3 =3;
const int leftPin4 =4;
const int dropPin5 =5;
void setup() {
  // put your setup code here, to run once:
pinMode(coinPin, OUTPUT);
pinMode(fwdPin1, OUTPUT);
pinMode(backPin2, OUTPUT);
pinMode(rightPin3, OUTPUT);
pinMode(leftPin4, OUTPUT);
pinMode(dropPin5, OUTPUT);
Serial.begin(115200);
}

void loop() {
  // put your main code here, to run repeatedly:
if(Serial.available()) {
  char input = Serial.read();
  if (input == '0') {
    digitalWrite(coinPin, LOW);
    digitalWrite(fwdPin1, LOW);
    digitalWrite(backPin2, LOW);
    digitalWrite(rightPin3, LOW);
    digitalWrite(leftPin4, LOW);
    digitalWrite(dropPin5, LOW);
  };
  if (input == '1') digitalWrite(fwdPin1, HIGH);
  if (input == '2') digitalWrite(backPin2, HIGH);
  if (input == '3') digitalWrite(rightPin3, HIGH);
  if (input == '4') digitalWrite(leftPin4, HIGH);
  if (input == '5') digitalWrite(dropPin5, HIGH);
  if (input == '6') digitalWrite(coinPin, HIGH);
}
}
