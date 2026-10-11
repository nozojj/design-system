import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";
import { TextField } from "@ds/ui";

const meta = {
  title: "Components/TextField",
  component: TextField,
  args: {
    label: "タイトル",
    placeholder: "Issueのタイトルを入力",
    required: false,
    disabled: false,
  },
  argTypes: {
    label: { control: "text" },
    description: { control: "text" },
    error: { control: "text" },
    placeholder: { control: "text" },
    required: { control: "boolean" },
    disabled: { control: "boolean" },
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 360 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof TextField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // ラベルのテキストで入力欄を見つけられる = label と input が紐づいている
    const input = canvas.getByLabelText("タイトル");
    await userEvent.type(input, "ログイン画面のバグ");
    await expect(input).toHaveValue("ログイン画面のバグ");
  },
};

export const WithDescription: Story = {
  args: { description: "50文字以内で入力してください" },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByLabelText("タイトル");

    // 説明文が入力欄の「説明」として読み上げられる
    await expect(input).toHaveAccessibleDescription(
      "50文字以内で入力してください",
    );
  },
};

export const WithError: Story = {
  args: {
    description: "50文字以内で入力してください",
    error: "タイトルは必須です",
    required: true,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole("textbox", { name: "タイトル" });

    // エラー状態であることと、説明＋エラーの両方が伝わる
    await expect(input).toBeInvalid();
    await expect(input).toHaveAccessibleDescription(
      "50文字以内で入力してください タイトルは必須です",
    );
  },
};

export const Required: Story = {
  args: { required: true },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // 見た目の「*」は読み上げず、required 属性で「必須」を伝える
    const input = canvas.getByRole("textbox", { name: "タイトル" });
    await expect(input).toBeRequired();
  },
};

export const Disabled: Story = {
  args: { disabled: true, defaultValue: "編集できません" },
};
