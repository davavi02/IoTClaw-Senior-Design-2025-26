# The drop move is seperate from the moveClaw as its an "endgame" move
# After the claw is dropped, a check is done to see if a prize was won or not
from moveClaw import moveClaw

async def dropClawAndDetect():
    print("Dropping and Detecting")
    await moveClaw(5)