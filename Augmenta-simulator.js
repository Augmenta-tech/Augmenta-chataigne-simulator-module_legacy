/*

Augmenta protocol :

https://github.com/Theoriz/Augmenta/wiki

This code has been tested on Chataigne 1.6.0+

*/

// Default values for reset
var sceneDefaultWidth = 640;
var sceneDefaultHeight = 480;
var maxNumPeople = 5;

// updateRate
var updateRate;
var lastUpdateTime = 0;

// personData
var personArray = [];
var personStateArray = [];
var pid = 0;

function init()
{
	// for now Chataigne allows 50hz max
	updateRate = local.parameters.updateRate.get() == 0?0:1.0 / local.parameters.updateRate.get();

	personArray = [local.values.person0,
					local.values.person1,
					local.values.person2,
					local.values.person3,
					local.values.person4];

//script.log("test",personArray[0].centroidX.get());

	// States : none entered update left
	for(var i=0;i<maxNumPeople;i++)
	{
		personStateArray[i] = "none";
	}
}

function update()
{
	// TODO check connection
	//if(!local.parameters.isConnected.get()) return;

	//script.log("mute "+local.parameters.mute.get());

	// Update rate computation
	var time = util.getTime();
	if(time > lastUpdateTime+updateRate)
	{
		lastUpdateTime = time;

		updateScene();
		sendScene();
		updatePersons();
		sendPersons();
	}
}

function moduleParameterChanged(param)
{
	if(param.name == "updateRate")
	{
		updateRate = param.get() == 0?0:1.0/param.get();
		script.log("new update rate : "+updateRate);

	} else if(param.name == "resetAll")
	{
		resetAll();
		//updateUI();

	} else if(param.name == "person0")
	{
		if(local.parameters.person0.get())
		{
			local.values.scene.numPeople.set(1);
		} else {
			local.values.scene.numPeople.set(0);
		}
		updateUI();

	} else if(param.name == "person1")
	{
		if(local.parameters.person1.get())
		{
			local.values.scene.numPeople.set(2);
		} else {
			local.values.scene.numPeople.set(1);
		}
		updateUI();

	} else if(param.name == "person2")
	{
		if(local.parameters.person2.get())
		{
			local.values.scene.numPeople.set(3);
		} else {
			local.values.scene.numPeople.set(2);
		}
		updateUI();

	} else if(param.name == "person3")
	{
		if(local.parameters.person3.get())
		{
			local.values.scene.numPeople.set(4);
		} else {
			local.values.scene.numPeople.set(3);
		}
		updateUI();

	} else if(param.name == "person4")
	{
		if(local.parameters.person4.get())
		{
			local.values.scene.numPeople.set(5);

		} else {
			local.values.scene.numPeople.set(4);

		}
		updateUI();

	}
}

function resetAll()
{
	script.log("Reseting all values to default");
	// reset scene to defaults values
	setScene(true,0,sceneDefaultWidth,sceneDefaultHeight,0);
	setScene(true,0,sceneDefaultWidth,sceneDefaultHeight,0); // dirty mandatory line for good UI

	// reset other coordinates
	// reset persons to defaults values
	for(var i=0;i<maxNumPeople;i++)
	{
		resetPerson(i);
	}
}

function setScene(ResetCurrentTime, numPeople, width, height, depth)
{
	if(ResetCurrentTime)
	{
		local.values.scene.currentTime.set(0);
	}

	setNumPeople(numPeople);
	local.values.scene.width.set(width);
	local.values.scene.height.set(height);
	local.values.scene.depth.set(depth);
}

function setPerson(oid, centroidX, centroidY, velocityX, velocityY, depth, boundingRectX, boundingRectY, boundingRectWidth, boundingRectHeight, highestX, highestY, highestZ)
{
	personArray[oid].pid.set(pid+1);
	pid++;
	// age is computed during update
	personArray[oid].centroidX.set(centroidX);
	personArray[oid].centroidY.set(centroidY);
	personArray[oid].velocityX.set(velocityX);
	personArray[oid].velocityY.set(velocityY);
	personArray[oid].depth.set(depth);
	personArray[oid].boundingRectX.set(boundingRectX);
	personArray[oid].boundingRectY.set(boundingRectY);
	personArray[oid].boundingRectY.set(boundingRectY);
	personArray[oid].boundingRectWidth.set(boundingRectWidth);
	personArray[oid].boundingRectHeight.set(boundingRectHeight);
	personArray[oid].highestX.set(highestX);
	personArray[oid].highestY.set(highestY);
	personArray[oid].highestZ.set(highestZ);

	setNumPeople(oid+1); // Sending the person when setting its value
}

function setNumPeople(numPeople)
{
	// Changing only if necessary
	if(local.values.scene.numPeople.get() != numPeople)
	{
		local.values.scene.numPeople.set(numPeople);
		script.log("Setting numPeople to " + local.values.scene.numPeople.get());
		updateUI();
	}
}

function updateScene()
{
	local.values.scene.currentTime.set(local.values.scene.currentTime.get()+1); // incrementing time
	local.parameters.scene.set(true); // setting UI
	// TODO : compute average motion here
	// TODO : computer percent covered here
}

function sendScene()
{
	local.send("/au/scene",
		local.values.scene.currentTime.get(),
		local.values.scene.percentCovered.get(),
		local.values.scene.numPeople.get(),
		local.values.scene.averageMotionX.get(),
		local.values.scene.averageMotionY.get(),
		local.values.scene.width.get(),
		local.values.scene.height.get(),
		local.values.scene.depth.get());
}

function updateUI()
{
	if(local.values.scene.numPeople.get() == 0)
	{
		local.parameters.person0.set(false);
		local.parameters.person1.set(false);
		local.parameters.person2.set(false);
		local.parameters.person3.set(false);
		local.parameters.person4.set(false);
		for(var i=0;i<maxNumPeople;i++)
		{
			personArray[i].sendData.set(false);
		}

	} else if(local.values.scene.numPeople.get() == 1)
	{
		local.parameters.person0.set(true);
		local.parameters.person1.set(false);
		local.parameters.person2.set(false);
		local.parameters.person3.set(false);
		local.parameters.person4.set(false);
		for(var i=maxNumPeople-1;i>4;i--)
		{
			personArray[i].sendData.set(false);
		}

	} else if(local.values.scene.numPeople.get() == 2)
	{
		local.parameters.person0.set(true);
		local.parameters.person1.set(true);
		local.parameters.person2.set(false);
		local.parameters.person3.set(false);
		local.parameters.person4.set(false);
		for(var i=maxNumPeople-1;i>1;i--)
		{
			personArray[i].sendData.set(false);
		}

	} else if(local.values.scene.numPeople.get() == 3)
	{
		local.parameters.person0.set(true);
		local.parameters.person1.set(true);
		local.parameters.person2.set(true);
		local.parameters.person3.set(false);
		local.parameters.person4.set(false);
		for(var i=maxNumPeople-1;i>2;i--)
		{
			personArray[i].sendData.set(false);
		}

	} else if(local.values.scene.numPeople.get() == 4)
	{
		local.parameters.person0.set(true);
		local.parameters.person1.set(true);
		local.parameters.person2.set(true);
		local.parameters.person3.set(true);
		local.parameters.person4.set(false);
		for(var i=maxNumPeople-1;i>3;i--)
		{
			personArray[i].sendData.set(false);
		}

	} else if(local.values.scene.numPeople.get() == 5)
	{
		local.parameters.person0.set(true);
		local.parameters.person1.set(true);
		local.parameters.person2.set(true);
		local.parameters.person3.set(true);
		local.parameters.person4.set(true);
	}
}

function resetPerson(oid)
{
	personArray[oid].age.set(0);
	personArray[oid].pid.set(0);
	personArray[oid].centroidX.set(0);
	personArray[oid].centroidY.set(0);
	personArray[oid].velocityX.set(0);
	personArray[oid].velocityY.set(0);
	personArray[oid].depth.set(0);
	personArray[oid].boundingRectX.set(0);
	personArray[oid].boundingRectY.set(0);
	personArray[oid].boundingRectWidth.set(0);
	personArray[oid].boundingRectHeight.set(0);
	personArray[oid].highestX.set(0);
	personArray[oid].highestY.set(0);
	personArray[oid].highestZ.set(0);
}

function updatePersons()
{
	for(var i=0;i<local.values.scene.numPeople.get();i++)
	{
		personArray[i].age.set(personArray[i].age.get() + 1);
	}
}

function sendPersons()
{
	for(var i=0;i<local.values.scene.numPeople.get();i++)
	{
		sendPerson(i,"update");
	}
}

function sendPerson(oid, state)
{	
	var address = "init";

	if(state == "update")
	{
		address = "/au/personUpdated";

	} else if(state == "entered")
	{
		address = "/au/personEntered";

	} else if(state == "left")
	{
		address = "/au/personWillLeave";
	}  

	local.send(

		address,
		personArray[oid].pid.get(),
		oid,
		personArray[oid].age.get(),
		personArray[oid].centroidX.get(),
		personArray[oid].centroidY.get(),
		personArray[oid].velocityX.get(),
		personArray[oid].velocityY.get(),
		personArray[oid].depth.get(),
		personArray[oid].boundingRectX.get(),
		personArray[oid].boundingRectY.get(),
		personArray[oid].boundingRectWidth.get(),
		personArray[oid].boundingRectHeight.get(),
		personArray[oid].highestX.get(),
		personArray[oid].highestY.get(),
		personArray[oid].highestZ.get());

	personArray[oid].sendData.set(true);
}
