$(window.document).ready(() => {
  let isConnect = false;

  $("#controlMetaMask").css("display", "none")
  if (!window.ethereum.isMetaMask) {
    $("#connectMetaMask").css("display", "none");
    $("#controlMetaMask").css("display", "block");
  }

  $("#connectMetaMask").on("click", () => {
    if (window.ethereum.isConnected()) {
      window.ethereum.request({ method : "eth_requestAccounts" }).then((res) => {
        $("#accountID").attr("value", res[0]);
        if (document.getElementById("accountID").getAttribute("value") !== undefined) {
          isConnect = true;
          if (isConnect) {
            $("#smallText").css("display", "none");
          }
        }
        if (window.ethereum.isConnected()) {
          $("#connectMetaMask").html("Connected!");
        }
      })
    }
  })
})