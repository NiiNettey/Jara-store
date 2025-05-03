$(document).ready(function () {
  $.ajax({
    url: "http://javv.x10.mx/backend/getUsers.php",
    method: "GET",
    dataType: "json",
    success: function (users) {
      let tbody = $(".users-tb");

      users.forEach((user) => {
        let row = `
                    <tr>
                        <td>${user.name}</td>
                        <td>${user.email}</td>
                        <td>${user.aType}</td>
                        <td class="td-actions text-right">
                            <button type="button" class="btn btn-info">
                                <i class="material-icons">edit</i>
                            </button>
                            <button type="button" class="btn btn-danger">
                                <i class="material-icons">block</i>
                            </button>
                        </td>
                    </tr>
                `;
        tbody.append(row);
      });
    },
    error: function (error) {
      console.log("Error fetching users:", error);
    },
  });
});
