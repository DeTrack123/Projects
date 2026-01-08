import java.io.*;
import java.util.*;

public class Menu {
  public static void main(String[] args) {
    Scanner sc = new Scanner(System.in);

    try {
      // Capture Customer Details
      System.out.println("=== Enter Customer Details ===");
      System.out.print("Name: ");
      String custName = sc.nextLine();
      System.out.print("Email: ");
      String custEmail = sc.nextLine();
      System.out.print("Phone: ");
      String custPhone = sc.nextLine();
      System.out.print("Address: ");
      String custAddress = sc.nextLine();
      System.out.print("Location (City): ");
      String custCity = sc.nextLine();

      // Check the code if it print out the correct information for the customer
      System.out.println("\nBelow is your details");
      Customer customer = new Customer(custName, custPhone, custAddress, custCity, custEmail);
      System.out.println(customer);

      // Capture Restaurant Details
      System.out.println("\n=== Enter Restaurant Details ===");
      System.out.print("Restaurant Name: ");
      String restName = sc.nextLine();
      System.out.print("Location (City): ");
      String restLocation = sc.nextLine();
      System.out.print("Contact Number: ");
      String restContact = sc.nextLine();

      // Check the code if it print out the correct information for the restaurant
      System.out.println("\nBelow is the restaurant's details");
      Restaurant restaurant = new Restaurant(restName, restLocation, restContact);
      System.out.println(restaurant);

      // Check the locations for the customer and the restaurant Match
      if (!custCity.equalsIgnoreCase(restLocation)) {
        System.out.println("\nSorry! Our drivers are too far away from you to be able to deliver to your location.");
        System.out.print("Do you want to enter a new city? Type 'yes' or 'exit': ");
        String input = sc.nextLine();

        // The user can leave the program if the restaurant is not in his location
        if (input.equalsIgnoreCase("exit")) {
          System.out.println("\nThank you for using the app.\nHave a nice day!");
          sc.close();
          return;
        } else {
          System.out.println("\nPlease restart the program and enter the new city.");
          sc.close();
          return;
        }
      }

      // Generate a order number for the user
      int orderNumber = (int) (Math.random() * 10000);
      System.out.println("\nYour order number is: " + orderNumber);

      // Ask the user how menu he what's to order
      System.out.print("How many meals? ");
      int mealCount = Integer.parseInt(sc.nextLine());

      // Arrays to store meal names, quantities, and prices
      String[] meals = new String[mealCount];
      int[] quantities = new int[mealCount];
      double[] prices = new double[mealCount];
      double total = 0;

      // Capture meal details
      for (int i = 0; i < mealCount; i++) {
        System.out.print("Meal name: ");
        meals[i] = sc.nextLine();

        System.out.print("Quantity: ");
        quantities[i] = Integer.parseInt(sc.nextLine());

        System.out.print("Price: ");
        prices[i] = Double.parseDouble(sc.nextLine());

        total += quantities[i] * prices[i];
      }

      System.out.print("Special instructions: ");
      String instructions = sc.nextLine();

      // Delivery or Collection
      System.out.print("\nType 'yes' if you prefer your order to be delivered to " + custAddress + ", " + custCity
          + " or 'no' to collect the order: ");
      String driverInput = sc.nextLine();

      Driver bestDriver = null;

      // If delivery is requested, find best driver
      if (driverInput.trim().equalsIgnoreCase("yes")) {
        try (BufferedReader reader = new BufferedReader(new FileReader("drivers.txt"))) {
          String line;
          while ((line = reader.readLine()) != null) {
            String[] parts = line.split(",\\s*");
            String driverName = parts[0];
            String driverLocation = parts[1];
            int driverLoad = Integer.parseInt(parts[2]);

            // Check if driver is in the same location as restaurant
            if (driverLocation.equalsIgnoreCase(restaurant.restaurantLocation)) {

              // Choose the driver with the smallest load
              if (bestDriver == null || driverLoad < bestDriver.load) {
                bestDriver = new Driver(driverName, driverLocation, driverLoad);
              }
            }
          }

          if (bestDriver != null) {
            System.out
                .println("\n" + bestDriver.name + " will deliver your order to " + custAddress + ", " + custCity + ".");
          } else {
            // If no driver are available the user can choose to collect the order himself
            System.out.println(
                "\nSorry! No drivers are available to deliver to your area.\nDo you want to collect the order yourself?\nType 'yes' or 'exit'");
            String collectInput = sc.nextLine();
            if (collectInput.equalsIgnoreCase("yes")) {
              System.out.println("We are looking forward to meeting you in person. See you soon!");
            } else {
              System.out.println("Thank you for using the app.\nHave a nice day!");
              sc.close();
              return;
            }
          }

        } catch (IOException e) {
          System.out.println("Error reading drivers.txt: " + e.getMessage());
          e.printStackTrace();
        }
      } else {
        System.out.println("We are looking forward to meeting you in person. See you soon!");
      }

      // Create the invoice
      try (BufferedWriter writer = new BufferedWriter(new FileWriter("invoice.txt"))) {
        // Customer detail
        writer.write("Order number: " + orderNumber + "\n\n");
        writer.write("=== Customer detail ===\n");
        writer.write(customer + "\n\n");

        // Order detail
        writer.write("=== Your order ===\n");
        writer.write("You have ordered the following from " + restName + " in " + restLocation + ":\n");

        for (int i = 0; i < mealCount; i++) {
          writer.write(quantities[i] + " x " + meals[i] + " (R" + String.format("%.2f", prices[i]) + ")\n");
        }

        writer.write("Total: R" + String.format("%.2f", total) + "\n");
        writer.write("\nSpecial instructions: " + instructions + "\n\n");

        // Driver detail
        writer.write("=== Detail for collection ===\n");
        if (bestDriver != null) {
          writer.write(bestDriver.name + " is nearest to the restaurant and will deliver your order to:\n");
          writer.write(custAddress + "\n" + custCity + "\n");
          writer
              .write("If you need to contact the restaurant, their number is " + restaurant.restaurantContact + ".\n");
          writer.write("Thank you for your order.\nHave a nice day!");
        } else {
          writer.write("Thank you for collecting your order.\nHave a nice day!");
        }

        System.out.println("Invoice created as invoice.txt");
      } catch (IOException e) {
        System.out.println("Error writing invoice: " + e.getMessage());
      }

    } catch (Exception e) {
      System.out.println("Unexpected error: " + e.getMessage());
      e.printStackTrace();
    } finally {
      sc.close();
    }
  }
}
