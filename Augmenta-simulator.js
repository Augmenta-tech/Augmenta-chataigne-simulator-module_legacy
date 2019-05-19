/*

Augmenta protocol :

https://github.com/Theoriz/Augmenta/wiki

This code has been tested on Chataigne 1.6.0+

*/

// Default values for reset
var sceneDefaultWidth = 640;
var sceneDefaultHeight = 480;
var maxNumPeople = 5;

var updateRate = local.parameters.updateRate.get() == 0?0:1.0 / local.parameters.updateRate.get(); // for now Chataigne allows 50hz max

function update()
{
	// TODO check connection
	//if(!local.parameters.isConnected.get()) return;

	if(!local.parameters.mute.get())
	{
		var time = util.getTime();
		if(time > lastUpdateTime+updateRate)
		{
			lastUpdateTime = time;
			sendScene();
			sendPersons();
		}
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
	}else if(param.name == "mute")
	{
		if(local.parameters.mute.get())
		{
			local.parameters.scene.set(false);
			local.parameters.person0.set(false);
			local.parameters.person1.set(false);
			local.parameters.person2.set(false);
			local.parameters.person3.set(false);
			local.parameters.person4.set(false);
		} else
		{
			updateUI();
		}
	}
}

function resetAll()
{
	script.log("Resetting all values to default");
	// reset scene to defaults values
	setScene(true,0,sceneDefaultWidth,sceneDefaultHeight,0);
	// reset other coordinates
	// reset persons to defaults values
	/*for(var i=0;i<maxNumPeople;i++)
	{
		//setPerson(i,);
		// reset other values
	}*/
}

function setScene(ResetCurrentTime, numPeople, width, height, depth)
{
	script.log("width : "+ width + " " + height);

	if(ResetCurrentTime)
	{
		local.values.scene.currentTime.set(0);
	}

	local.values.scene.numPeople.set(numPeople);
	local.values.scene.width.set(width);
	local.values.scene.height.set(height);
	local.values.scene.depth.set(depth);
	//updateUI();
}

function setPerson()
{

}

function setNumPeople(numPeople)
{
	local.values.scene.numPeople.set(numPeople);
	script.log("Setting numPeople to " + local.values.scene.numPeople.get());
	//updateUI();
}

function sendScene()
{
	local.parameters.scene.set(true);
	//scene.age.set(1);
}

function sendPersons()
{

}

function updateUI()
{
	// Just updating UI (parameters)
	if(local.values.scene.numPeople.get() == 1)
	{
		local.parameters.person0.set(true);

	} else if(local.values.scene.numPeople.get() == 2)
	{
		local.parameters.person0.set(true);
		local.parameters.person1.set(true);

	} else if(local.values.scene.numPeople.get() == 3)
	{
		local.parameters.person0.set(true);
		local.parameters.person1.set(true);
		local.parameters.person2.set(true);

	} else if(local.values.scene.numPeople.get() == 4)
	{
		local.parameters.person0.set(true);
		local.parameters.person1.set(true);
		local.parameters.person2.set(true);
		local.parameters.person3.set(true);

	} else if(local.values.scene.numPeople.get() == 5)
	{
		local.parameters.person0.set(true);
		local.parameters.person1.set(true);
		local.parameters.person2.set(true);
		local.parameters.person3.set(true);
		local.parameters.person4.set(true);
	}
}