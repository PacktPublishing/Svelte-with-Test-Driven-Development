Feature: Editing a birthday
  Scenario: Correcting the year of birth
    Given An existing birthday for "Hercules" on "1992-03-04"
    When I navigate to the "/birthdays" page
    And I edit the birthday for "Hercules" to be "1994-04-06"
    Then the birthday for "Hercules" should show "1994-04-06"
    And the text "1992-03-04" should not appear on the page
