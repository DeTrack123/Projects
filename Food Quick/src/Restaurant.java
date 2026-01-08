public class Restaurant {

//Attributes
  String restaurantName;
  String restaurantLocation;
  String restaurantContact;

  // Method
  public Restaurant(String restaurantName, String restaurantLocation, String restaurantContact) {
    this.restaurantName = restaurantName;
    this.restaurantLocation = restaurantLocation;
    this.restaurantContact = restaurantContact;
  }

  // Print Restaurant details
  public String toString() {
    String output = "Restaurant Name: " + restaurantName;
    output += "\nRestaurant Location: " + restaurantLocation;
    output += "\nRestaurant Phone number: " + restaurantContact;
    return output;
  }
}