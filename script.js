document.querySelectorAll('.ttt-cell').forEach(cell => {
  cell.textContent = '?';
});

document.querySelectorAll('.ttt-cell').forEach(cell => {
  cell.addEventListener("click", function () {
  cell.textContent = 'o'; 
  cell.classList.add(`played-o`);
 
  })
})

let p1 = 'Player 1';
let p2 = 'Player 2';

let currentPlayerName = p2;

document.getElementById('turn-indicator').innerText = `${currentPlayerName}'s Turn`;

document.querySelector("#btn-restart").addEventListener("click", function () {
  const cells = document.querySelectorAll(".ttt-cell");
  cells.forEach(cell => {
    cell.textContent = "?"; 
    cell.classList.remove("played-x", "played-o")
});
})