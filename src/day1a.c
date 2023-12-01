#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <ctype.h>

const unsigned BUF_LENGTH = 8192;
char *read_input(char *filename)
{
  FILE *fd = fopen(filename, "r");
  if (fd == NULL) {
    printf("Failed to open input file (%s)...", filename);
    exit(1);
  }

  char *data = NULL;
  size_t data_len = 0;
  char buf[BUF_LENGTH];
  while (fgets(buf, BUF_LENGTH, fd)) {
    size_t len = strlen(buf) + data_len + 1;
    data = realloc(data, len);
    data_len = len - 1;
    strcat(data, buf);
  }

  fclose(fd);

  return data;
}

int main()
{
  char *input = read_input("src/day1.txt");

  int nums[1000];
  size_t input_len = strlen(input);
  char *c = input;
  size_t num_idx = 0;
  int num1 = -1;
  int num2 = -1;
  while (c - input < input_len) {
    if (isdigit(*c)) {
      if (num1 == -1) {
        num1 = *c - '0';
        num2 = *c - '0';
      } else {
        num2 = *c - '0';
      }
    } else if (*c == '\n') {
      nums[num_idx++] = num1 * 10 + num2;
      num1 = -1;
      num2 = -1;
    }
    c++;
  }

  int sum = 0; 
  for (int i = 0; i < num_idx; i++) {
    sum += nums[i];
    printf("nums[%d] = %d\n", i, nums[i]);
  }

  printf("Answer: %d\n", sum);

  free(input);

  return 0;
}
