public class Customer {

  // Attributes
  String name;
  String phone;
  String address;
  String location;
  String email;

  // Method
  public Customer(String name, String phone, String address, String location, String email) {
    this.name = name;
    this.phone = phone;
    this.address = address;
    this.location = location;
    this.email = email;
  }

  // Print Customer details
  public String toString() {
    String output = "Customer: " + name;
    output += "\nEmail: " + email;
    output += "\nPhone number: " + phone;
    output += "\nAddress: " + address;
    output += "\nLocation: " + location;
    return output;
  }

}
