public class Driver {
  String name;
  String location;
  int load;

  public Driver(String name, String location, int load) {
    this.name = name;
    this.location = location;
    this.load = load;
  }

  // Print Customer details
  public String toString() {
    String output = "Driver: " + name;
    output += "\nLocation: " + location;
    output += "\nLoad: " + load;
    return output;
  }
}
