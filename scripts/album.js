
var createSongRow = function(songNumber, songName, songLength) {
	var template =
		'<tr class="album-view-song-item">'
	+	'	<td class="song-item-number" data-song-number="' + songNumber + '">' + songNumber + '</td>'
	+	'	<td class="song-item-title">' + songName + '</td>'
	+	'	<td class="song-item-duration">' + filterTimeCode(songLength) + '</td>'
	+	'</tr>'
	;
	
	var $row = $(template);
	
	var clickHandler = function() {
		var songNumber = parseInt($(this).attr('data-song-number'));

		if (currentlyPlayingSongNumber !== null) {
			var currentlyPlayingCell = getSongNumberCell(currentlyPlayingSongNumber);
			currentlyPlayingCell.html(currentlyPlayingSongNumber);

		}
		if (currentlyPlayingSongNumber !== songNumber) {
			setSong(songNumber);
			currentSoundFile.play();
			updateSeekBarWhileSongPlays();
			$(this).html(pauseButtonTemplate);
			updatePlayerBarSong();
			updateSeekPercentage($('.volume .seek-bar'), currentVolume / 100);
			
		} else if (currentlyPlayingSongNumber === songNumber) {
			if (currentSoundFile.isPaused()) {
				$(this).html(pauseButtonTemplate);
				$('.main-controls .play-pause').html(playerBarPauseButton);
				currentSoundFile.play();
				updateSeekBarWhileSongPlays();
			} else {
				$(this).html(playButtonTemplate);
				$('.main-controls .play-pause').html(playerBarPlayButton);
				currentSoundFile.pause();
			}
			
			
		}
		
	};
	
	var onHover = function(event) {
		var songItem = $(this).find('.song-item-number');
		var songItemNumber = parseInt(songItem.attr('data-song-number'));
		if (songItemNumber !== currentlyPlayingSongNumber) {
			songItem.html(playButtonTemplate);
		}

	};
	
	var offHover = function(event) {
		var songItem = $(this).find('.song-item-number');
		var songItemNumber = parseInt(songItem.attr('data-song-number'));
		if (songItemNumber !== currentlyPlayingSongNumber) {
			songItem.html(songItemNumber);
		}
		
	};
	
	$row.find('.song-item-number').click(clickHandler);
	$row.hover(onHover, offHover);
	return $row;
};

var setSong = function(songNumber) {
	if (currentSoundFile) {
		currentSoundFile.stop();
	}
	currentlyPlayingSongNumber = parseInt(songNumber);
	currentSongFromAlbum = currentAlbum.songs[songNumber - 1];
	
	currentSoundFile = new buzz.sound(currentSongFromAlbum.audioUrl, {
		formats: [ 'mp3' ],
		preload: true
	});
	
	setVolume(currentVolume);
};

var seek = function(time) {
	if (currentSoundFile) {
		currentSoundFile.setTime(time);
	}
};

var setVolume = function(volume) {
	if (currentSoundFile) {
		currentSoundFile.setVolume(volume);
	}
};

var getSongNumberCell = function(number) {
	return $('.song-item-number[data-song-number="' + number + '"]');
}

var setCurrentAlbum = function(album) {
	currentAlbum = album;
	var $albumTitle = $('.album-view-title');
	var $albumArtist = $('.album-view-artist');
	var $albumReleaseInfo = $('.album-view-release-info');
	var $albumImage = $('.album-cover-art');
	var $albumSongList = $('.album-view-song-list'); 
	
	$albumTitle.text(album.title);
    $albumArtist.text(album.artist);
    $albumReleaseInfo.text(album.year + ' ' + album.label);
    $albumImage.attr('src', album.albumArtUrl);
	
	$albumSongList.empty();
	
	for (var i = 0; i < album.songs.length; i++) {
		var $newRow = createSongRow(i + 1, album.songs[i].title, album.songs[i].duration);
		$albumSongList.append($newRow); 
	}
	
};

var trackIndex = function(album, song) {
	return album.songs.indexOf(song);
}

var nextSong = function() {
    
    var getLastSongNumber = function(index) {
        return index == 0 ? currentAlbum.songs.length : index;
    };
    
    var currentSongIndex = trackIndex(currentAlbum, currentSongFromAlbum);
    // Note that we're _incrementing_ the song here
    currentSongIndex++;
    
    if (currentSongIndex >= currentAlbum.songs.length) {
        currentSongIndex = 0;
    }
    
    // Set a new current song
    var songNumber = currentSongIndex + 1;
	setSong(songNumber);
	currentSoundFile.play();
	updatePlayerBarSong();
	updateSeekBarWhileSongPlays();
	

    // Update the Player Bar information
    $('.currently-playing .song-name').text(currentSongFromAlbum.title);
    $('.currently-playing .artist-name').text(currentAlbum.artist);
    $('.currently-playing .artist-song-mobile').text(currentSongFromAlbum.title + " - " + currentAlbum.title);
    $('.main-controls .play-pause').html(playerBarPauseButton);
    
    var lastSongNumber = getLastSongNumber(currentSongIndex);
    var $nextSongNumberCell = getSongNumberCell(currentlyPlayingSongNumber);
    var $lastSongNumberCell = getSongNumberCell(lastSongNumber);
    
    $nextSongNumberCell.html(pauseButtonTemplate);
    $lastSongNumberCell.html(lastSongNumber);
	updateSeekPercentage($('.volume .seek-bar'), currentVolume / 100);
    
};

var previousSong = function() {
    
    // Note the difference between this implementation and the one in
    // nextSong()
    var getLastSongNumber = function(index) {
        return index == (currentAlbum.songs.length - 1) ? 1 : index + 2;
    };
    
    var currentSongIndex = trackIndex(currentAlbum, currentSongFromAlbum);
    // Note that we're _decrementing_ the index here
    currentSongIndex--;
    
    if (currentSongIndex < 0) {
        currentSongIndex = currentAlbum.songs.length - 1;
    }
    
    // Set a new current song
    var songNumber = currentSongIndex + 1;
	setSong(songNumber);
	currentSoundFile.play();
	updatePlayerBarSong();
	updateSeekBarWhileSongPlays();
	

    // Update the Player Bar information
    $('.currently-playing .song-name').text(currentSongFromAlbum.title);
    $('.currently-playing .artist-name').text(currentAlbum.artist);
    $('.currently-playing .artist-song-mobile').text(currentSongFromAlbum.title + " - " + currentAlbum.title);
    $('.main-controls .play-pause').html(playerBarPauseButton);
    
    var lastSongNumber = getLastSongNumber(currentSongIndex);
    var $previousSongNumberCell = getSongNumberCell(currentlyPlayingSongNumber);
    var $lastSongNumberCell = getSongNumberCell(lastSongNumber);
    
    $previousSongNumberCell.html(pauseButtonTemplate);
    $lastSongNumberCell.html(lastSongNumber);
	updateSeekPercentage($('.volume .seek-bar'), currentVolume / 100);
    
};

var togglePlayFromPlayerBar = function() {
	if (currentSoundFile) {
		var currentlyPlayingCell = getSongNumberCell(currentlyPlayingSongNumber);
		if (currentSoundFile.isPaused()) {
			currentlyPlayingCell.html(pauseButtonTemplate);
			$(this).html(playerBarPauseButton);
			currentSoundFile.play();
			updatePlayerBarSong();
			updateSeekBarWhileSongPlays();
			updateSeekPercentage($('.volume .seek-bar'), currentVolume / 100);
		} else {
			currentlyPlayingCell.html(playButtonTemplate);
			$(this).html(playerBarPlayButton);
			currentSoundFile.pause();
		}
	} else {
		setSong(1);
		var currentlyPlayingCell = getSongNumberCell(currentlyPlayingSongNumber);
		currentlyPlayingCell.html(pauseButtonTemplate);
		$(this).html(playerBarPauseButton);
		currentSoundFile.play();
		updatePlayerBarSong();
		updateSeekBarWhileSongPlays();
		updateSeekPercentage($('.volume .seek-bar'), currentVolume / 100);
	}
};


var updatePlayerBarSong = function() {
	var currentSong = currentSongFromAlbum.title;
	var currentSongArtist = currentAlbum.artist;
	var currentSongTotalTime = currentSongFromAlbum.duration;
	$('.currently-playing .song-name').text(currentSong);
	$('.currently-playing .artist-song-mobile').text(currentSong + " - " + currentSongArtist);
	$('.currently-playing .artist-name').text(currentSongArtist);
	
	$('.main-controls .play-pause').html(playerBarPauseButton);
	setTotalTimeInPlayerBar(currentSongTotalTime);
};

var updateSeekPercentage = function($seekBar, seekBarFillRatio) {
	var offsetXPercent = seekBarFillRatio * 100;
	offsetXPercent = Math.max(0, offsetXPercent);
	offsetXPercent = Math.min(100, offsetXPercent);
	
	var percentageString = offsetXPercent + '%';
	$seekBar.find('.fill').width(percentageString);
	$seekBar.find('.thumb').css({left: percentageString});
};

var setupSeekBars = function() {
	var $seekBars = $('.player-bar .seek-bar');
	
	$seekBars.click(function(event) {
		
		var offsetX = event.pageX - $(this).offset().left;
		var barWidth = $(this).width();
		
		var seekBarFillRatio = offsetX / barWidth;
		
		if (currentSoundFile && $(this).parent().attr('class') == 'seek-control') {
			var time = seekBarFillRatio * currentSoundFile.getDuration();
			seek(time);
		} else {
			var volume = seekBarFillRatio * 100;
			setVolume(volume);
		}
		
		updateSeekPercentage($(this), seekBarFillRatio);
	});
	
	$seekBars.find('.thumb').mousedown(function(event) {
		
		var $seekBar = $(this).parent();
		
		$(document).bind('mousemove.thumb', function(event) {
			var offsetX = event.pageX - $seekBar.offset().left;
			var barWidth = $seekBar.width();
			var seekBarFillRatio = offsetX / barWidth;
		
			if (currentSoundFile && $seekBar.parent().attr('class') == 'seek-control') {
				var time = seekBarFillRatio * currentSoundFile.getDuration();
				seek(time);
			} else {
				var volume = seekBarFillRatio * 100;
				setVolume(volume);
			}
			
			updateSeekPercentage($seekBar, seekBarFillRatio);
		
		});
		
		$(document).bind('mouseup.thumb', function() {
			$(document).unbind('mouseup.thumb');
			$(document).unbind('mousemove.thumb');
		});
	});
};

var updateSeekBarWhileSongPlays = function() {
	if (currentSoundFile) {
		
		currentSoundFile.bind('timeupdate', function(event) {
			
			var seekBarFillRatio = this.getTime() / this.getDuration();
			var $seekBar = $('.seek-control .seek-bar');
			setCurrentTimeInPlayerBar(this.getTime());
			
			updateSeekPercentage($seekBar, seekBarFillRatio);
		});
	}
};


var setCurrentTimeInPlayerBar = function(currentTime) {
	$('.current-time').text(filterTimeCode(currentTime));
};

var setTotalTimeInPlayerBar = function(totalTime) {
	$('.total-time').text(filterTimeCode(totalTime));
};

var filterTimeCode = function(timeInSeconds) {
	var totalSeconds = parseFloat(timeInSeconds);
	var minutes = Math.floor(totalSeconds / 60);
	var seconds = Math.floor(totalSeconds % 60);
	if (seconds < 10) {
		return minutes + ':0' + seconds;
	} else {
		return minutes + ':' + seconds;
	}
	
};

var playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>';
var pauseButtonTemplate = '<a class="album-song-button"><span class="ion-pause"></span></a>';
var playerBarPlayButton = '<span class="ion-play"></span>';
var playerBarPauseButton = '<span class="ion-pause"></span>';


var currentAlbum = null;
var currentlyPlayingSongNumber = null;
var currentSongFromAlbum = null;
var currentSoundFile = null;
var currentVolume = 80;

var $previousButton = $('.main-controls .previous');
var $nextButton = $('.main-controls .next');
var $playPauseButton = $('.main-controls .play-pause');

$(document).ready(function() {
	
	setCurrentAlbum(albumPicasso);
	$previousButton.click(previousSong);
	$nextButton.click(nextSong);
	$playPauseButton.click(togglePlayFromPlayerBar);
	setupSeekBars();
	
});