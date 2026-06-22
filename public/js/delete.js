

 function deleteimage(roomId, filename){

  fetch(`/Rooms/${roomId}/image/${filename}`, {
    method: "DELETE"
  })
  .then(res => res.text())
  .then(data => {
     console.log(data);
     location.reload(); // simple refresh
  });

}