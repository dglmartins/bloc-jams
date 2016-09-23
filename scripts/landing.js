var animatePoints = function() {
	var points = document.getElementsByClassName("point");
	
	var revealPoint = function(pointsIndex) {
		points[pointsIndex].style.opacity = 1;
		points[pointsIndex].style.transform = "scaleX(1) translateY(0)";
		points[pointsIndex].style.msTransform =  "scaleX(1) translateY(0)";
		points[pointsIndex].style.WebkitTransform =  "scaleX(1) translateY(0)";
	};
	
	for (var i = 0; i < points.length; i++) {
		revealPoint(i);
	}

	
};

